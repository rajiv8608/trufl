import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SeataguestService } from './seataguest.service'
import { SharedService } from '../shared/Shared.Service';
import { Router } from '@angular/router';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    selector: 'seataGuest',
    templateUrl: './seataguest.component.html',
    styleUrls: ['./seataguest.style.css'],
    providers: [ToastsManager, ToastOptions]

})

export class SeataGuestComponent implements OnInit {
    public seatguestdetails: any = [];
    public imagepath: any;
    public filterHostids: any;
    public show: any;
    public filteredarray: any
    public trimmedArray: any = [];
    public filteredhostessArray: any = [];
    public user_accept: any;
    public count = 0;
    public selected_objects: any = [];
    public error_message: any;
    public showmessage = false;
    public imageborder: any;
    public active: boolean = false;
    public servers: any;
    public waitlist: any;
    public issideOpen: boolean = false;
    public before_sort: any;
    public iswaitlistOpen: boolean = true;
    public isserversOpen: boolean = false;
    public restID = localStorage.getItem('restaurantid');
    public select_tab: any;
    public unique_id: any;
    public getrowData: any;
    public tblResLength: any;
    public toogleBool: boolean = true;
    public style = {};
    public error_msg: any;
    public errorcode;
    public statusmessage;
    public blExceedsPartySize: boolean = false;

    public getTableType: any;
    public TotalSelectable: any;
    public SeatedNowCount:any;
    public showDialog: any;
    public commonmessage: any;
    public getseatednow_count: any;
    //public table_array: any = [];
   // public tableType_array: any = [];


    // public confirm_message: any;
    ngOnInit() {
        this.imagepath = 'data:image/JPEG;base64,';
        this.getseated(this.restID);
        this.getwaitlist();
        this.show = true;
        this.getrowData = localStorage.getItem('acceptoffer rowdata');
        this.user_accept = JSON.parse(this.getrowData);
        // this.unique_id = this.sharedService.uniqueid;
        this.unique_id = localStorage.getItem('uniqueid');
    }

    public removeDuplicates(originalArray, objKey) {
        var values = [];
        var value;
        for (var i = 0; i < originalArray.length; i++) {
            value = originalArray[i][objKey];
            if (values.indexOf(value) === -1) {
                this.trimmedArray.push(originalArray[i]);
                values.push(value);
            }
        }
        return this.trimmedArray;
    }

    constructor(private seataguestService: SeataguestService, public sharedService: SharedService, private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef) {
        this.style = JSON.parse(localStorage.getItem("stylesList")) || [];
        this._toastr.setRootViewContainerRef(vRef);
    }

    public getseated(restID: any) {
        this.seataguestService.getseateddetails(restID).subscribe((res: any) => {
            //this.before_sort = res._Data;
            if (res._Data.SeatAGuest.length > 0) {
                this.before_sort = res._Data.SeatAGuest;
                if (res._Data.GetSeatedAvbl.length > 0) {
                    this.getTableType = res._Data.GetSeatedAvbl[0].TableType;
                    this.TotalSelectable = res._Data.GetSeatedAvbl[0].TotalSelectable;
                }
            }

            if (res._Data.length == 0) {
                this.seataguestService.emptyResponse(restID).subscribe((res: any) => {
                    this.errorcode = res._ErrorCode;
                    this.statusmessage = res._Data;
                    if (this.errorcode == 50000) {
                        this._toastr.error(this.statusmessage);
                    }
                })
            }
            else {
                if (res._Data.SeatAGuest.length > 0) {
                    this.seatguestdetails = this.before_sort.sort(function (a, b) {
                        return a.TableNumber - b.TableNumber;
                    })
                }
                    this.tblResLength = res._Data.length;
                    this.filterHostids = this.removeDuplicates(this.seatguestdetails, 'HostessID');
                
            }
        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        });
    }

    //select seats
    selectseats(selectseats: any) {
        if (this.selected_objects.length < 6) {
            this.seatguestdetails.forEach((itemdata, index) => {
                if (itemdata.TableNumber == selectseats.TableNumber && itemdata.TableStatus == false) {
                    this.seatguestdetails[index].TableStatus = !this.seatguestdetails[index].TableStatus;
                    this.imageborder = true;
                    return;
                }
                else {
                    if (itemdata.TableNumber == selectseats.TableNumber && itemdata.TableStatus == true) {
                        this.seatguestdetails[index].TableStatus = !this.seatguestdetails[index].TableStatus;
                        return;
                    }
                }
            })
        }

        else if (this.selected_objects.length >= 6) {
            this.seatguestdetails.forEach((itemdata, index) => {
                if (itemdata.TableNumber == selectseats.TableNumber && itemdata.TableStatus == true) {
                    this.seatguestdetails[index].TableStatus = !this.seatguestdetails[index].TableStatus;
                    return;
                }

            })
        }

        if (this.selected_objects.length) {

            let index = this.selected_objects.findIndex(function (selectedobject) {
                return selectedobject.TableNumber === selectseats.TableNumber;
            })
            if (index >= 0) {
                this.selected_objects[index] = selectseats;
                if (selectseats.TableStatus == true) {
                    this.count = this.count + selectseats.TableType;
                }
                else {
                    this.count = this.count - selectseats.TableType;
                    this.selected_objects.splice(index, 1);
                    //this.SeatedNowCount = this.SeatedNowCount - 1;
                }

            }
            else {
                if (this.selected_objects.length < 6) {
                    this.selected_objects.push(selectseats);
                    this.count = this.count + selectseats.TableType;
                   
                }
                else {
                 //alert("Can not select morethan 6 tables");
                 this.showDialog = true;
                  this.commonmessage = "Can not select morethan 6 tables"
                }
            }
        }
        else {
            this.selected_objects.push(selectseats);
            this.count = this.count + selectseats.TableType;
        }

        console.log(this.selected_objects);

        if (this.count > 0 && this.count < this.user_accept.PartySize) {
            this.showmessage = true;
            this.active = false;
            this.toogleBool = true;
            this.blExceedsPartySize = false;
            this.error_message = "please select another table to accommodate this large party";
        } else if (this.count == 0) {
            this.showmessage = false;
            this.active = false;
            this.toogleBool = true;
            this.blExceedsPartySize = false;
        }
        else {
            this.active = true;
            this.showmessage = false;
            this.toogleBool = false;
            this.blExceedsPartySize = false;
        }
    }

   

    //show waitlist in seataguest sidenav
    public gethostess(HostessID: any) {
        this.show = !this.show;
        let copyoffinalarry = this.seatguestdetails;
        this.filteredarray = copyoffinalarry.filter(function (tag) {
            return tag.HostessID == HostessID;
        });
        this.filteredhostessArray = this.trimmedArray.filter(function (tag) {
            return tag.HostessID == HostessID;
        })
    }

    //show servers in seataguest sidenav
    getservers() {
        this.select_tab = 'servers';
        this.iswaitlistOpen = false;
        this.isserversOpen = true;

        this.seataguestService.getservers(this.restID).subscribe((res: any) => {
            this.servers = res._Data;

        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        })
    }

    getwaitlist() {
        this.select_tab = 'waitlist';
        this.isserversOpen = false;
        this.iswaitlistOpen = true;
        this.seataguestService.getwaitlist(this.restID).subscribe((res: any) => {
            this.waitlist = res._Data;
        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        })
    }

    PreviousPage() {
        if (this.unique_id == "addguest") {
            this.router.navigate(['addGuest']);
        }
        else if (this.unique_id == "edit_guest") {

            this.sharedService.editguestDetails = this.user_accept;
            this.router.navigate(['editguest']);
        }
        else if (this.unique_id == "notify") {
            this.router.navigate(['waitlist']);
        }
        else if (this.unique_id == "accept_offer") {
            this.router.navigate(['waitlist']);
        }
        else if (this.unique_id == "accept_offersidenav") {
            this.router.navigate(['waitlist']);
        }
        else {
            this.router.navigate(['waitlist']);
        }
    }

    

    //confirmation of selected seats
    confirm() {
        this.error_msg = "an error occured";
        var table_array = [];
        var tableType_array = [];
        //  var cntTable = 1;

        console.log(this.selected_objects);
        this.SeatedNowCount = 0
        this.selected_objects.forEach((table, index) => {
            if (table.TableStatus == true) {
                table_array.push(table.TableNumber);
                tableType_array.push(table.TableType);
            }
            if (table.TableType == this.getTableType) {
                this.SeatedNowCount = this.SeatedNowCount + 1;
            }
        })

        var table_types = tableType_array.join();
        var table_numbers = table_array.join();

        if (this.restID) {
            var restID = JSON.parse(this.restID);
        }
        if (this.user_accept.PartySize) {
            var partysize = JSON.parse(this.user_accept['PartySize']);

        }
        if (this.user_accept.waitquoted) {
            var QuotedTime = JSON.parse(this.user_accept['waitquoted'])
        }


        /* get seated now checking */

        if (this.SeatedNowCount > this.TotalSelectable) {
            this.showDialog = !this.showDialog;          
            this.getseatednow_count = this.SeatedNowCount - this.TotalSelectable;
            this.commonmessage = "You have selected " + this.getseatednow_count+ " table from allocated GetTableNow. Do you want to continue?"
        }
        else {
            if (this.user_accept.BookingID) {
                this.seataguestService.verifyuser(this.user_accept.BookingID, this.user_accept.TruflUserID, restID).subscribe((res: any) => {
                    if (res._ErrorCode == '1') {
                        window.setTimeout(() => {
                            this._toastr.error(res._Data);
                        }, 500);
                    }
                    else if (res._ErrorCode == '0') {
                        if (this.unique_id == "addguest") {
                            var addobj = {
                                "RestaurantID": restID,
                                "FullName": this.user_accept.UserName,
                                "Email": this.user_accept.email,
                                "ContactNumber": this.user_accept.mobile,
                                "UserType": 'TU',
                                "PartySize": partysize,
                                "QuotedTime": QuotedTime,
                                "Relationship": this.user_accept.relationship,
                                "ThisVisit": this.user_accept.visit,
                                "FoodAndDrink": this.user_accept.food,
                                "SeatingPreferences": this.user_accept.seating,
                                "Description": this.user_accept.notes,
                                "WaitListTime": null,
                                "BookingStatus": 3,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types,

                            }
                            this.seataguestService.newguestconfirmation(addobj).subscribe((res: any) => {
                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);
                                    }, 500);
                                }
                                else if (res._ErrorCode == '50000') {
                                    this.sharedService.email_error = "Email Id Already Exists";
                                    this.router.navigate(['addGuest']);
                                }
                                else if (res._ErrorCode == '0') {
                                    this.sharedService.email_error = '';
                                    this.router.navigate(['seated']);
                                }
                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                              })
                            /* Print Function*/
                            var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=400,toolbar=0,scrollbars=0,status=0');
                            WinPrint.document.write('<html><head><title></title>');
                            WinPrint.document.write('<link rel="stylesheet" href="assets/css/print.css" media="print" type="text/css"/>');
                            WinPrint.document.write('</head><body> <h1>Receipt</h1>');
                            var arr: any = [
                              {
                                key: "TRUFL STATUS",
                                value: ''
                              },
                              {
                                key: this.restID,
                                value: ""
                              },
                              {
                                key: "GUEST NAME",
                                value: addobj.FullName
                              },
                              {
                                key: "PARTY SIZE",
                                value: addobj.PartySize
                              },
                              { key: "WAIT QUOTED", value: addobj.QuotedTime },
                              { key: "TIME QUOTED", value: addobj.WaitListTime },
                              { key: "THIS VISIT", value: addobj.ThisVisit },
                              { key: "RELATIONSHIP", value: addobj.Relationship },
                              { key: "SEATING AND PREFERENCES", value: addobj.SeatingPreferences },
                              { key: "FOOD AND DRINK PREFERENCES", value: addobj.FoodAndDrink }
                            ];

                            WinPrint.document.write('<table>');
                            let selected = this;
                            arr.forEach((item) => {
                              if (item.key == "undefined" || item.key == "null") {
                                item.key = '';
                              }
                              if (item.value == undefined || item.value == null) {
                                item.value = '';
                              }
                              WinPrint.document.write('<tr><th>' + item.key + '</th><td>' + item.value + '</td></tr>');
                            })

                            WinPrint.document.write('</table>');
                            WinPrint.document.write('</body>');
                            setTimeout(function () {
                              WinPrint.focus();
                              WinPrint.print();
                              WinPrint.close();
                            }, 1000);
                            return false;
                        }
                        else if (this.unique_id == "edit_guest") {
                            var editobject = {
                                "RestaurantID": this.user_accept.RestaurantID,
                                "TruflUserID": this.user_accept.TruflUserID,
                                "FullName": this.user_accept.UserName,
                                "Email": this.user_accept.Email,
                                "PartySize": partysize,
                                "QuotedTime": QuotedTime,
                                "ContactNumber": this.user_accept.PhoneNumber,
                                "Relationship": this.user_accept.Relationship,
                                "ThisVisit": this.user_accept.ThisVisit,
                                "WaitListTime": null,
                                "FoodAndDrink": this.user_accept.FoodAndDrinkPreferences,
                                "SeatingPreferences": this.user_accept.SeatingPreferences,
                                "Description": this.user_accept.Description,
                                "BookingID": this.user_accept.BookingID,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types
                            }
                            this.seataguestService.editguestconfirmation(editobject).subscribe((res: any) => {

                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);
                                    }, 500);
                                }
                                else if (res._ErrorCode == '50000') {
                                    this.sharedService.email_error = "Email Id Already Exists";
                                    this.router.navigate(['editguest']);
                                    localStorage.setItem('editguestDetails', JSON.stringify(this.user_accept));
                                }
                               else if (res._ErrorCode == '0') {

                                  if (this.user_accept.OfferType == '3') {
                                       let obj = {
                                            TruflUserID: this.user_accept.TruflUserID,
                                            RestaurantID: this.user_accept.RestaurantID,
                                            BillAmount: 0,
                                            RewardType: "SEATED"
                                       }

                                     this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                        if (res._ErrorCode == '1') {
                                             window.setTimeout(() => {
                                                 this._toastr.error(this.error_msg);

                                              }, 500);
                                          }
                                          else if (res._ErrorCode == '0') {
                                                this.sharedService.email_error = '';
                                                this.router.navigate(['seated']);
                                           }

                                        }, (err) => {
                                            if (err == 0) {
                                                this._toastr.error('network error')
                                            }
                                        })

                                    }
                                    else {
                                        this.router.navigate(['seated']);
                                    }

                                }
                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                              })
                            /*Print Function*/
                            var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=400,toolbar=0,scrollbars=0,status=0');
                            WinPrint.document.write('<html><head><title></title>');
                            WinPrint.document.write('<link rel="stylesheet" href="assets/css/print.css" media="print" type="text/css"/>');
                            WinPrint.document.write('</head><body> <h1>Receipt</h1>');
                            var arr: any = [
                              {
                                key: "TRUFL STATUS",
                                value: ''
                              },
                              {
                                key: this.restID,
                                value: ""
                              },
                              {
                                key: "GUEST NAME",
                                value: editobject.FullName
                              },
                              {
                                key: "PARTY SIZE",
                                value: editobject.PartySize
                              },
                              { key: "WAIT QUOTED", value: editobject.QuotedTime },
                              { key: "TIME QUOTED", value: editobject.WaitListTime },
                              { key: "THIS VISIT", value: editobject.ThisVisit },
                              { key: "RELATIONSHIP", value: editobject.Relationship },
                              { key: "SEATING AND PREFERENCES", value: editobject.SeatingPreferences },
                              { key: "FOOD AND DRINK PREFERENCES", value: editobject.FoodAndDrink }
                            ];

                            WinPrint.document.write('<table>');
                            let selected = this;
                            arr.forEach((item) => {
                              if (item.key == "undefined" || item.key == "null") {
                                item.key = '';
                              }
                              if (item.value == undefined || item.value == null) {
                                item.value = '';
                              }
                              WinPrint.document.write('<tr><th>' + item.key + '</th><td>' + item.value + '</td></tr>');
                            })

                            WinPrint.document.write('</table>');
                            WinPrint.document.write('</body>');
                            setTimeout(function () {
                              WinPrint.focus();
                              WinPrint.print();
                              WinPrint.close();
                            }, 1000);
                            return false;
                        }

                        else if (this.unique_id == "notify") {
                            let obj = {
                                "BookingID": this.user_accept.BookingID,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types
                            }
                            
                            this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);
                                    }, 500);
                                }
                                else if (res._ErrorCode == '0') {
                                    this.router.navigate(['seated']);
                                }

                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                            })
                        }
                        else if (this.unique_id == "accept_offer") {
                            let obj = {
                                "BookingID": this.user_accept.BookingID,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types
                            }
                            this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {


                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);

                                    }, 500);
                                }
                                else if (res._ErrorCode == '0') {

                                  if (this.user_accept.OfferType == '3') {
                                     let obj = {
                                            TruflUserID: this.user_accept.TruflUserID,
                                            RestaurantID: this.user_accept.RestaurantID,
                                            BillAmount: 0,
                                            RewardType: "SEATED"
                                      }
                                     this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                            if (res._ErrorCode == '1') {
                                                window.setTimeout(() => {
                                                    this._toastr.error(this.error_msg);

                                                }, 500);
                                          }
                                            else if (res._ErrorCode == '0') {
                                                this.router.navigate(['seated']);
                                          }

                                        }, (err) => {
                                            if (err == 0) {
                                                this._toastr.error('network error')
                                            }
                                        })

                                    }
                                    else {
                                        this.router.navigate(['seated']);
                                    }
                                }

                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                            })

                        }
                        else if (this.unique_id == "accept_offersidenav") {
                            let obj = {
                                "BookingID": this.user_accept.BookingID,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types
                            }
                            this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);

                                    }, 500);
                                }
                                else if (res._ErrorCode == '0') {
                                    this.router.navigate(['seated']);
                                }
                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                            })

                        }
                        // move to seataguest to select seats from sidenav
                        else if (this.unique_id == "tables_sidenav") {

                            let obj = {
                                "BookingID": this.user_accept.BookingID,
                                "TableNumbers": table_numbers,
                                "SeatedTableType": table_types
                            }

                            this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                if (res._ErrorCode == '1') {
                                    window.setTimeout(() => {
                                        this._toastr.error(this.error_msg);

                                    }, 500);
                                }
                                else if (res._ErrorCode == '0') {
                                    if (this.user_accept.OfferType == '3') {
                                        let obj = {
                                            TruflUserID: this.user_accept.TruflUserID,
                                            RestaurantID: this.user_accept.RestaurantID,
                                            BillAmount: 0,
                                            RewardType: "SEATED"
                                        }

                                        this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                            if (res._ErrorCode == '1') {
                                                window.setTimeout(() => {
                                                    this._toastr.error(this.error_msg);

                                                }, 500);
                                            }
                                            else if (res._ErrorCode == '0') {
                                                this.router.navigate(['seated']);
                                            }

                                        }, (err) => {
                                            if (err == 0) {
                                                this._toastr.error('network error')
                                            }
                                        })
                                    }

                                    else {
                                        this.router.navigate(['seated']);
                                    }
                                }

                            }, (err) => {
                                if (err === 0) {
                                    this._toastr.error('network error')
                                }
                            })

                        }
                    }

                }, (err) => {
                    if (err === 0) {
                        this._toastr.error('network error')
                    }
                })

                /*verify exists for seating  end*/
            }


            else {

                if (this.unique_id == "addguest") {
                    var addobj = {
                        "RestaurantID": restID,
                        "FullName": this.user_accept.UserName,
                        "Email": this.user_accept.email,
                        "ContactNumber": this.user_accept.mobile,
                        "UserType": 'TU',
                        "PartySize": partysize,
                        "QuotedTime": QuotedTime,
                        "Relationship": this.user_accept.relationship,
                        "ThisVisit": this.user_accept.visit,
                        "FoodAndDrink": this.user_accept.food,
                        "SeatingPreferences": this.user_accept.seating,
                        "Description": this.user_accept.notes,
                        "WaitListTime": null,
                        "BookingStatus": 3,
                        "TableNumbers": table_numbers,
                        "SeatedTableType": table_types
                    }
                    this.seataguestService.newguestconfirmation(addobj).subscribe((res: any) => {
                        if (res._ErrorCode == '1') {
                            window.setTimeout(() => {
                                this._toastr.error(this.error_msg);

                            }, 500);
                        }

                        else if (res._ErrorCode == '50000') {
                            this.sharedService.email_error = "Email Id Already Exists";
                            this.router.navigate(['addGuest']);
                        }
                        else if (res._ErrorCode == '0') {
                            this.sharedService.email_error = '';
                            this.router.navigate(['seated']);
                        }
                    }, (err) => {
                        if (err === 0) {
                            this._toastr.error('network error')
                        }
                      })
                    /* Print Function*/
                    var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=400,toolbar=0,scrollbars=0,status=0');
                    WinPrint.document.write('<html><head><title></title>');
                    WinPrint.document.write('<link rel="stylesheet" href="assets/css/print.css" media="print" type="text/css"/>');
                    WinPrint.document.write('</head><body> <h1>Receipt</h1>');
                    var arr: any = [
                      {
                        key: "TRUFL STATUS",
                        value: ''
                      },
                      {
                        key: this.restID,
                        value: ""
                      },
                      {
                        key: "GUEST NAME",
                        value: addobj.FullName
                      },
                      {
                        key: "PARTY SIZE",
                        value: addobj.PartySize
                      },
                      { key: "WAIT QUOTED", value: addobj.QuotedTime },
                      { key: "TIME QUOTED", value: addobj.WaitListTime },
                      { key: "THIS VISIT", value: addobj.ThisVisit },
                      { key: "RELATIONSHIP", value: addobj.Relationship },
                      { key: "SEATING AND PREFERENCES", value: addobj.SeatingPreferences },
                      { key: "FOOD AND DRINK PREFERENCES", value: addobj.FoodAndDrink }
                    ];

                    WinPrint.document.write('<table>');
                    let selected = this;
                    arr.forEach((item) => {
                      if (item.key == "undefined" || item.key == "null") {
                        item.key = '';
                      }
                      if (item.value == undefined || item.value == null) {
                        item.value = '';
                      }
                      WinPrint.document.write('<tr><th>' + item.key + '</th><td>' + item.value + '</td></tr>');
                    })

                    WinPrint.document.write('</table>');
                    WinPrint.document.write('</body>');
                    setTimeout(function () {
                      WinPrint.focus();
                      WinPrint.print();
                      WinPrint.close();
                    }, 1000);
                    return false;
                }

            }
            
        }
        
        /*verify exists for seating */   
               
    }

    Ok() {
      this.showDialog = !this.showDialog;
        var table_array = [];
        var tableType_array = [];

        this.selected_objects.forEach((table, index) => {
            if (table.TableStatus == true) {
                table_array.push(table.TableNumber);
                tableType_array.push(table.TableType);
            }
           
        })


        var table_types = tableType_array.join();
        var table_numbers = table_array.join();

        if (this.restID) {
            var restID = JSON.parse(this.restID);
        }
        if (this.user_accept.PartySize) {
            var partysize = JSON.parse(this.user_accept['PartySize']);

        }
        if (this.user_accept.waitquoted) {
            var QuotedTime = JSON.parse(this.user_accept['waitquoted'])
        }

        if (this.getTableType) {
            var getTableType = JSON.parse(this.getTableType);
        }
        if (this.getseatednow_count) {
            var getseatednow_count = JSON.parse(this.getseatednow_count);
        }


        //update get seated now
        this.seataguestService.updategetseatednow(restID, getTableType, getseatednow_count).subscribe((res: any) => {
            if (res._ErrorCode == '1') {
                window.setTimeout(() => {
                    this._toastr.error(this.error_msg);
                }, 500);
            }            
            else if (res._ErrorCode == '0') {

                if (this.user_accept.BookingID) {
                    this.seataguestService.verifyuser(this.user_accept.BookingID, this.user_accept.TruflUserID, restID).subscribe((res: any) => {

                        if (res._ErrorCode == '1') {
                            window.setTimeout(() => {
                                this._toastr.error(res._Data);
                            }, 500);
                        }
                        else if (res._ErrorCode == '0') {
                            if (this.unique_id == "addguest") {
                                var addobj = {
                                    "RestaurantID": restID,
                                    "FullName": this.user_accept.UserName,
                                    "Email": this.user_accept.email,
                                    "ContactNumber": this.user_accept.mobile,
                                    "UserType": 'TU',
                                    "PartySize": partysize,
                                    "QuotedTime": QuotedTime,
                                    "Relationship": this.user_accept.relationship,
                                    "ThisVisit": this.user_accept.visit,
                                    "FoodAndDrink": this.user_accept.food,
                                    "SeatingPreferences": this.user_accept.seating,
                                    "Description": this.user_accept.notes,
                                    "WaitListTime": null,
                                    "BookingStatus": 3,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types,
                                }
                                this.seataguestService.newguestconfirmation(addobj).subscribe((res: any) => {
                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);
                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '50000') {
                                        this.sharedService.email_error = "Email Id Already Exists";
                                        this.router.navigate(['addGuest']);
                                    }
                                    else if (res._ErrorCode == '0') {
                                        this.sharedService.email_error = '';
                                        this.router.navigate(['seated']);
                                    }
                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })
                            }
                            else if (this.unique_id == "edit_guest") {
                                var editobject = {
                                    "RestaurantID": this.user_accept.RestaurantID,
                                    "TruflUserID": this.user_accept.TruflUserID,
                                    "FullName": this.user_accept.UserName,
                                    "Email": this.user_accept.Email,
                                    "ContactNumber": this.user_accept.PhoneNumber,
                                    "Relationship": this.user_accept.Relationship,
                                    "ThisVisit": this.user_accept.ThisVisit,
                                    "FoodAndDrink": this.user_accept.FoodAndDrinkPreferences,
                                    "SeatingPreferences": this.user_accept.SeatingPreferences,
                                    "Description": this.user_accept.Description,
                                    "BookingID": this.user_accept.BookingID,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types
                                }
                                this.seataguestService.editguestconfirmation(editobject).subscribe((res: any) => {

                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);
                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '50000') {
                                        this.sharedService.email_error = "Email Id Already Exists";
                                        this.router.navigate(['editguest']);
                                        localStorage.setItem('editguestDetails', JSON.stringify(this.user_accept));
                                    }
                                    else if (res._ErrorCode == '0') {

                                        if (this.user_accept.OfferType == '3') {
                                            let obj = {
                                                TruflUserID: this.user_accept.TruflUserID,
                                                RestaurantID: this.user_accept.RestaurantID,
                                                BillAmount: 0,
                                                RewardType: "SEATED"
                                            }

                                            this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                                if (res._ErrorCode == '1') {
                                                    window.setTimeout(() => {
                                                        this._toastr.error(this.error_msg);

                                                    }, 500);
                                                }
                                                else if (res._ErrorCode == '0') {
                                                    this.sharedService.email_error = '';
                                                    this.router.navigate(['seated']);
                                                }

                                            }, (err) => {
                                                if (err == 0) {
                                                    this._toastr.error('network error')
                                                }
                                            })

                                        }
                                        else {
                                            this.router.navigate(['seated']);
                                        }

                                    }
                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })
                            }

                            else if (this.unique_id == "notify") {

                                let obj = {
                                    "BookingID": this.user_accept.BookingID,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types
                                }


                                this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);
                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '0') {
                                        this.router.navigate(['seated']);
                                    }

                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })
                            }
                            else if (this.unique_id == "accept_offer") {
                                let obj = {
                                    "BookingID": this.user_accept.BookingID,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types
                                }
                                this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {


                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);

                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '0') {

                                        if (this.user_accept.OfferType == '3') {
                                            let obj = {
                                                TruflUserID: this.user_accept.TruflUserID,
                                                RestaurantID: this.user_accept.RestaurantID,
                                                BillAmount: 0,
                                                RewardType: "SEATED"
                                            }
                                            this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                                if (res._ErrorCode == '1') {
                                                    window.setTimeout(() => {
                                                        this._toastr.error(this.error_msg);

                                                    }, 500);
                                                }
                                                else if (res._ErrorCode == '0') {
                                                    this.router.navigate(['seated']);
                                                }

                                            }, (err) => {
                                                if (err == 0) {
                                                    this._toastr.error('network error')
                                                }
                                            })

                                        }
                                        else {
                                            this.router.navigate(['seated']);
                                        }
                                    }

                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })

                            }
                            else if (this.unique_id == "accept_offersidenav") {
                                let obj = {
                                    "BookingID": this.user_accept.BookingID,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types
                                }
                                this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);

                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '0') {
                                        this.router.navigate(['seated']);
                                    }
                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })

                            }
                            // move to seataguest to select seats from sidenav
                            else if (this.unique_id == "tables_sidenav") {

                                let obj = {
                                    "BookingID": this.user_accept.BookingID,
                                    "TableNumbers": table_numbers,
                                    "SeatedTableType": table_types
                                }

                                this.seataguestService.UpdateWaitListSeated(obj).subscribe((res: any) => {

                                    if (res._ErrorCode == '1') {
                                        window.setTimeout(() => {
                                            this._toastr.error(this.error_msg);

                                        }, 500);
                                    }
                                    else if (res._ErrorCode == '0') {
                                        if (this.user_accept.OfferType == '3') {
                                            let obj = {
                                                TruflUserID: this.user_accept.TruflUserID,
                                                RestaurantID: this.user_accept.RestaurantID,
                                                BillAmount: 0,
                                                RewardType: "SEATED"
                                            }

                                            this.seataguestService.saverestaurentrewards(obj).subscribe((res) => {
                                                if (res._ErrorCode == '1') {
                                                    window.setTimeout(() => {
                                                        this._toastr.error(this.error_msg);

                                                    }, 500);
                                                }
                                                else if (res._ErrorCode == '0') {
                                                    this.router.navigate(['seated']);
                                                }

                                            }, (err) => {
                                                if (err == 0) {
                                                    this._toastr.error('network error')
                                                }
                                            })
                                        }

                                        else {
                                            this.router.navigate(['seated']);
                                        }
                                    }

                                }, (err) => {
                                    if (err === 0) {
                                        this._toastr.error('network error')
                                    }
                                })

                            }
                        }

                    }, (err) => {
                        if (err === 0) {
                            this._toastr.error('network error')
                        }
                    })

                    /*verify exists for seating  end*/
                }


                else {

                    if (this.unique_id == "addguest") {
                        var addobj = {
                            "RestaurantID": restID,
                            "FullName": this.user_accept.UserName,
                            "Email": this.user_accept.email,
                            "ContactNumber": this.user_accept.mobile,
                            "UserType": 'TU',
                            "PartySize": partysize,
                            "QuotedTime": QuotedTime,
                            "Relationship": this.user_accept.relationship,
                            "ThisVisit": this.user_accept.visit,
                            "FoodAndDrink": this.user_accept.food,
                            "SeatingPreferences": this.user_accept.seating,
                            "Description": this.user_accept.notes,
                            "WaitListTime": null,
                            "BookingStatus": 3,
                            "TableNumbers": table_numbers,
                            "SeatedTableType": table_types
                        }
                        this.seataguestService.newguestconfirmation(addobj).subscribe((res: any) => {
                            if (res._ErrorCode == '1') {
                                window.setTimeout(() => {
                                    this._toastr.error(this.error_msg);

                                }, 500);
                            }

                            else if (res._ErrorCode == '50000') {
                                this.sharedService.email_error = "Email Id Already Exists";
                                this.router.navigate(['addGuest']);
                            }
                            else if (res._ErrorCode == '0') {
                                this.sharedService.email_error = '';
                                this.router.navigate(['seated']);
                            }
                        }, (err) => {
                            if (err === 0) {
                                this._toastr.error('network error')
                            }
                        })
                    }

                }






               
            }
        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        })

    }

    Cancel() {
        this.showDialog = !this.showDialog;
    }
        

}


