
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReservationService } from './reservation.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/Shared.Service';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as moment from 'moment';
@Component({
    selector: 'reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.style.css'],
    providers: [ToastsManager, ToastOptions]
})
export class ReservationComponent implements OnInit {

    public selectdate = new Date();
    public changeformat: any;
    public guestdetails: any;
    public data: any = {};
    public restID = localStorage.getItem('restaurantid');
    public partysize: any;
    public quotedtime: any;
    public reserved = false;
    //calendar
    index = 0;
    isDateRequired = false;
    inputDate = null;
    month = null;
    calFocus = null;
    isActive = null;
    isRequired = null;
    errorMessage = null;
    datesOfInterest = [];
    footerData = [];
    date = moment().format('MM/DD/YYYY');
    public currentDay: any;
    public currentMonth: any;
    public currentYear: any;
    public Month_Change: any;
    public Year_Change: any;
    public error_message: any;
    public show_message: boolean = false;
    public errormessage_data: any;
    public next_day: any;
    public next_month: any;
    public next_year: any;
    /*  made changes  */
    public currentdate: any;
    public current_time: any;
    public isValid: boolean = false;

    daysInWeek = [
        {
            day: "S",
            title: "Sunday"
        },
        {
            day: "M",
            title: "Monday"
        },
        {
            day: "T",
            title: "Tuesday"
        },
        {
            day: "W",
            title: "Wednesday"
        },
        {
            day: "T",
            title: "Thursday"
        },
        {
            day: "F",
            title: "Friday"
        },
        {
            day: "S",
            title: "Saturday"
        }
    ];
    _removeTime(date) {
        return date.hour(0).minute(0).second(0).millisecond(0);
    }


    _buildWeek(ctrl, date, month) {
        var today = new Date();
        var days = [];

        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format('dd').substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(today, 'day'),
                date: date
            });

            date = date.clone();
            date.add(1, 'd');
        }

        return days;
    }

    _buildMonth(ctrl, start, month) {
        var done = false;
        var date = start.clone();
        var monthIndex = date.month();
        var count = 0;

        ctrl.weeks = [];

        while (!done) {
            ctrl.weeks.push({ days: this._buildWeek(ctrl, date.clone(), month) });
            date.add(1, 'w');
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    getDayCls = function (day) {
        return day.isCurrentMonth ? (day.isToday ? 'is-today' : (moment(day.date._d).format('L') === this.date ? 'is-selected-date' : 'is-in-month')) : 'is-not-in-month';
    };

    next() {
        this.datesOfInterest = [];
        this.footerData = [];
        var next = this.month.clone();
        this._removeTime(next.month(next.month() + 1).date(1));
        next.day(0);
        this.month.month(this.month.month() + 1);

        /*date format changing*/

        this.Month_Change = this.month._d.getMonth() + 1;
        this.Year_Change = this.month._d.getFullYear();
        /* date format changing end*/
        this._buildMonth(this, next, this.month);
    };

    prev() {
        this.datesOfInterest = [];
        this.footerData = [];
        var prev = this.month.clone();
        this._removeTime(prev.month(prev.month() - 1).date(1));
        prev.day(0);
        this.month.month(this.month.month() - 1);
        this._buildMonth(this, prev, this.month);

        /*date format changing*/
        this.Month_Change = this.month._d.getMonth() + 1;
        this.Year_Change = this.month._d.getFullYear();
        /*date format changing end*/
    };

    onOffClick_event() {
        this.isActive = this.isActive ? this.calFocus ? true : false : false;
        if (!this.isActive) {
            if (this.errorMessage) {
            }
            this.errorMessage = false;
        }

    };

    clicked = function () {
        this.isActive = false;
    };

    showCurrentDate(day) {
        this.date = moment(day, "MM/DD/YYYY").format('MM/DD/YYYY');
        this.inputDate = moment(this.date, "MM/DD/YYYY");
        this.month = this._removeTime(this.inputDate || moment());
        // Create calendar for current month
        var start = this.month.clone();
        start.date(1);
        this._removeTime(start.day(0));
        this._buildMonth(this, start, this.month);
    };

    onDayClick(day) {

        this.errorMessage = false;
        this.isActive = true;
        this.date = moment(day.date, "MM/DD/YYYY").format('MM/DD/YYYY');
        var date = this.date;
        var datearray = date.split("/");


        this.changeformat = [datearray[2], datearray[0], datearray[1]].join("-");
        this.selectdate = new Date(this.date);

    };
    // calendar end
    ngOnInit() {

        this.inputDate = moment(moment(), "MM/DD/YYYY");
        this.month = this._removeTime(this.inputDate || moment());
        this.calFocus = false;
        this.isActive = true;
        // Create calendar for current month
        var start = this.month.clone();
        start.date(1);
        this._removeTime(start.day(0));
        this._buildMonth(this, start, this.month);
        if (this.isRequired) {
            this.isDateRequired = this.isRequired;
        }

        var today = new Date();
        this.currentDay = today.getDate();
        this.currentMonth = today.getMonth() + 1;
        this.currentYear = today.getFullYear();
        this.Month_Change = today.getMonth() + 1;
        this.Year_Change = today.getFullYear();
        /*future days disabled */
        this.next_day = today.setDate(today.getDate() + 90);

        this.next_month = today.getUTCMonth() + 1; //months from 1-12
        this.next_day = today.getUTCDate();
        this.next_year = today.getUTCFullYear();

        /*future days disabled end*/


    }


    constructor(private reservationService: ReservationService, private router: Router, private sharedService: SharedService, private _toastr: ToastsManager, vRef: ViewContainerRef) {
        this._toastr.setRootViewContainerRef(vRef);
    }

    // save reservation
    onSubmit(reservationdetails: any, form: NgForm) {
        this.reserved = true;
        this.errormessage_data = "an error occured";
        if (this.changeformat == null) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            this.changeformat = yyyy + '-' + mm + '-' + dd;
        }

        var datetime = this.changeformat + 'T' + reservationdetails.time;

        this.guestdetails = JSON.parse(localStorage.getItem('acceptoffer rowdata'));

        if (this.restID) {
            this.restID = JSON.parse(this.restID);
        }
        if (this.guestdetails.PartySize) {
            this.partysize = this.guestdetails['PartySize'];
        }
        if (this.guestdetails.waitquoted === null || this.guestdetails.waitquoted === undefined) {

            this.quotedtime = '';
        }

        var obj = {
            "RestaurantID": this.restID,
            "FullName": this.guestdetails['UserName'],
            "Email": this.guestdetails['email'],
            "ContactNumber": this.guestdetails['mobile'],
            "UserType": 'TU',
            "PartySize": this.partysize,
            "QuotedTime": this.quotedtime,
            "Relationship": this.guestdetails['relationship'],
            "ThisVisit": this.guestdetails['visit'],
            "FoodAndDrink": this.guestdetails['food'],
            "SeatingPreferences": this.guestdetails['seating'],
            "Description": this.guestdetails['notes'],
            "WaitListTime": datetime,
            "BookingStatus": 7,
            "TableNumbers": ''
        }

        this.reservationService.sendreservationdetails(obj).subscribe((res: any) => {

            if (res._ErrorCode == '1') {
                window.setTimeout(() => {
                    this._toastr.error(this.errormessage_data);

                }, 500);
            }

            else if (res._ErrorCode == '50000') {
                this.show_message = true;
                this.sharedService.email_error = "Email Id Already Exists";
                this.error_message = "Email Id Already Exists";
                this.router.navigate(['addGuest']);
            }
            else if (res._ErrorCode == '0') {
                this.sharedService.email_error = '';
                this.router.navigate(['waitlist']);
            }
        })
    }

    cancel() {
        this.sharedService.email_error = '';
        this.router.navigate(['addGuest']);
    }

    checking(timevalue: any) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        this.currentdate = yyyy + '-' + mm + '-' + dd;
        if (this.changeformat == null) {
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            this.changeformat = yyyy + '-' + mm + '-' + dd;
        }
        if (this.changeformat == this.currentdate) {
          var h = today.getHours();
          var m = today.getMinutes();
          this.current_time = h + ":" + m;
          if (this.current_time > timevalue) {
            this.isValid = false
          }
          else {
            this.isValid = true;
          }
        }
        else {
            this.isValid = true;
          }

    }

isValidForm() {
    return this.isValid;
}
}

