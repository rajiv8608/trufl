import {Component, ViewContainerRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GuestService} from './addguest.service';
import {Router} from '@angular/router';
import {SharedService} from '../shared/Shared.Service';
import {ToastOptions} from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { saveAs } from 'file-saver';
@Component({
  selector: 'addGuest',
  templateUrl: './addguest.component.html',
  styleUrls: ['./addguest.style.css'],
  providers: [ToastsManager, ToastOptions]
})
export class AddGuestComponent {
  public data: any = {};
  public number: any;
  public restID = localStorage.getItem('restaurantid');
  public error_message: any;
  public show_message: boolean = false;
  public QuotedTime: any;
  public DOB: any;
  public TimeAdded: any;
  public partysize: any;
  public errormessage: any;
  public addguest_details: any;
  public email_ids: any;  
  
  constructor(private guestservice: GuestService, private router: Router, private sharedService: SharedService, private _toastr: ToastsManager, vRef: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vRef);
   
  }

  ngOnInit() {
     

      
    localStorage.setItem("uniqueid", "addguest");

    if (localStorage.getItem('acceptoffer rowdata')) {
      this.addguest_details = JSON.parse(localStorage.getItem('acceptoffer rowdata')) || [];
    }

    if (this.sharedService.email_error) {
      this.error_message = this.sharedService.email_error;
      this.show_message = true;
    }


    this.guestservice.emailverify().subscribe((res: any) => {
      this.email_ids = res._Data;
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })


  }

    getToday(): any {            
        return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  }

  isNumberKey(event: any) { // without type info
      var x = event.target.value;  
      event.target.value=x.replace(/[^0-9\.]/g, '');
      
  }
  
  onSubmit(guestdetails: any, form: NgForm) {

    

    this.errormessage = "an error occured";
    if (this.restID) {
      this.restID = JSON.parse(this.restID);
    }
    if (guestdetails.PartySize) {
      this.partysize = JSON.parse(guestdetails['PartySize']);

    }
    if (guestdetails.waitquoted) {
      this.QuotedTime = JSON.parse(guestdetails['waitquoted'])
    }

    if (guestdetails.waitquoted === null || guestdetails.waitquoted === undefined) {
      this.QuotedTime = ''
    }
    if (guestdetails.DOB === null || guestdetails.DOB === undefined) {
      this.DOB = ''
    }
    if (guestdetails.DOB) {
      this.DOB = guestdetails['DOB']
    }
    if (guestdetails.relationship === null || guestdetails.relationship === undefined) {
      guestdetails.relationship = ''
    }
    if (guestdetails.visit === null || guestdetails.visit === undefined) {
      guestdetails.visit = ''
    }
    if (guestdetails.food === null || guestdetails.food === undefined) {
      guestdetails.food = ''
    }

    if (guestdetails.seating === null || guestdetails.seating === undefined) {
      guestdetails.seating = ''
    }

    if (guestdetails.notes === null || guestdetails.notes == undefined) {
      guestdetails.notes = ''
    }
    if (guestdetails.email === null || guestdetails.email === undefined) {
      guestdetails.email = ''
    }
    this.TimeAdded = new Date();


    var obj = {
      "RestaurantID": this.restID,
      "FullName": guestdetails.UserName,
      "Email": guestdetails.email,
      "ContactNumber": guestdetails.mobile,
      "UserType": 'TU',
      "PartySize": this.partysize,
      "QuotedTime": this.QuotedTime,
      "DOB": this.DOB,
      "TimeAdded":this.TimeAdded,
      "Relationship": guestdetails.relationship,
      "ThisVisit": guestdetails.visit,
      "FoodAndDrink": guestdetails.food,
      "SeatingPreferences": guestdetails.seating,
      "Description": guestdetails.notes,
      "WaitListTime": null,
      "BookingStatus": 2,
      "TableNumbers": ''
    } 

    //email duplication checking
    this.data = guestdetails;
    if (guestdetails.email != '') {
      var keepGoing = true;
      this.email_ids.map((item, index) => {
        if (keepGoing) {
          if (guestdetails.email.toLowerCase().indexOf(item.Email.toLowerCase()) > -1) {
            this.show_message = true;
            this.error_message = "Email Id Already Exists";
            keepGoing = false
          }
        }
      })

      //add user to waitlist
      if (this.number == 1 && keepGoing == true) {
        this.guestservice.addGuestDetails(obj).subscribe((res: any) => {

          if (res._ErrorCode == 1) {
            window.setTimeout(() => {
              this._toastr.error(this.errormessage);

            }, 500);
          }
          else if (res._ErrorCode == 0) {
            this.sharedService.email_error = '';
            this.router.navigate(['waitlist']);
          }

        }, (err) => {
          if (err === 0) {
            this._toastr.error('network error')
          }
        })

      }

      //move to seataguest
      else if (this.number == 2 && keepGoing == true) {
        // this.sharedService.uniqueid = "addguest";

        localStorage.setItem('acceptoffer rowdata', JSON.stringify(guestdetails)) || [];
        this.router.navigate(['seataGuest'])
      }
      //move to add reservation
      else if (this.number == 3 && keepGoing == true) {
        localStorage.setItem('acceptoffer rowdata', JSON.stringify(guestdetails)) || [];
        this.router.navigate(['reservation']);
      }
      else if (this.number == 4 && keepGoing == true){
        this.Emailverify(guestdetails);
      }

    }

    else {
      //add user to waitlist
      if (this.number == 1) {
        this.guestservice.addGuestDetails(obj).subscribe((res: any) => {
          if (res._ErrorCode == 1) {
            window.setTimeout(() => {
              this._toastr.error(this.errormessage);

            }, 500);
          }
          else if (res._ErrorCode == 0) {
            this.sharedService.email_error = '';
            this.router.navigate(['waitlist']);
          }
        }, (err) => {
          if (err === 0) {
            this._toastr.error('network error')
          }
        })

      }
      //move to seataguest
      else if (this.number == 2) {
        this.sharedService.uniqueid = "addguest";

        localStorage.setItem('acceptoffer rowdata', JSON.stringify(guestdetails)) || [];
        this.router.navigate(['seataGuest'])
      }
      //move to reservation
      else if (this.number == 3) {
        localStorage.setItem('acceptoffer rowdata', JSON.stringify(guestdetails)) || [];
        this.router.navigate(['reservation']);
      }
      else if (this.number == 4){
        this.Emailverify(guestdetails);
      }

    }


  }

  get(number: any) {
    this.number = number;
  }

  editguest(guestrecord: any) {
    this.sharedService.guestDetails = guestrecord;
    this.router.navigate(['editguest']);
  }
 
  cancel() {
    this.sharedService.email_error = '';
    this.router.navigate(['waitlist']);
  }

  change(data: any) {
    this.show_message = false;

  }
  public Emailverify(guestdetails:any) {
    var arr = [];
    /*added code*/   
    arr.push({
      FullName: guestdetails.UserName,
      Email: guestdetails.email,
      ContactNumber: guestdetails.mobile,
      PartySize: this.partysize,
      QuotedTime: this.QuotedTime,
      DOB: this.DOB,
      Relationship: guestdetails.relationship,
      ThisVisit: guestdetails.visit,
      FoodAndDrink: guestdetails.food,
      SeatingPreferences: guestdetails.seating,
      Description: guestdetails.notes

    })    
    var csvData = this.ConvertToCSV(arr);
    let file = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'Report.csv');

    /*added code end*/


  }

  // convert Json to CSV data in Angular2
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
  

}
