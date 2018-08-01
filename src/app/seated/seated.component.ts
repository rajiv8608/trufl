import { Component, ViewContainerRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { SeatedService } from './seated.service';
import { Router } from '@angular/router';
import { LoginService } from '../shared/login.service';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OtherSettingsService } from '../defaultsettings/othersettings/other-settings.service'
import { StaffService } from '../selectstaff/select-staff.service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'seated',
  templateUrl: './seated.component.html',
  styleUrls: ['./seated.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class SeatedComponent implements OnInit {

  public seatedinfo: any = [];
  public isenabled = false;
  private restaurantName: any;
  private restarauntid: any;
  private truflid;
  public items: any = [];
  private otherdiningtime;
  private othersettingsdetails;
  private errorcode: any;
  private statusmessage: any;
  showDialog = false;
  private emptybookingid;
  public commonmessage;
  private isempty;
  private billamount: any;
  private rewardtype: any;
  public showProfile: boolean = false;
  public currentSelectedUser: string;
  private username;
  private pic;
  private profileData: any = [];
  private usertype: any;
  private RestaurantId;
  private selectedRow: Number;
  private data: any;
  private bookingid;
  private restaurantid: any;
  /*added code*/
  public style;
  public restID = localStorage.getItem('restaurantid');
  public sorted_seatedinfo: any;
  public modalRef: BsModalRef;
  public serverTblNO: any;
  public ServerDetailsList: any = [];
  /*added code end*/
  constructor(private seatedService: SeatedService, private loginService: LoginService, private _othersettings: OtherSettingsService, private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef, private selectstaff: StaffService, private modalService: BsModalService) {

    this._toastr.setRootViewContainerRef(vRef);
    this.restaurantName = this.loginService.getRestaurantName();
    this.restarauntid = this.loginService.getRestaurantId();
    this.style = JSON.parse(localStorage.getItem("stylesList")) || [];
    //called first time before the ngOnInit()
    /*servers List for model */
    this.seatedService.GetServerDetails(this.restID).subscribe(res => {
      this.ServerDetailsList = res._Data.ManageServer;
      /*     this.ServerListLoader = false;*/
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
    /*servers List for model end */

  }

  ngOnInit() {
    this.getSeatedDetails(this.restarauntid);
    if (localStorage.getItem("stylesList") == null) {
      this.dummy();
    }
  }

  //subscribe the seated data over here
  getSeatedDetails(restarauntid) {
    let that = this;
    this._othersettings.getOtherSettingsDetails(restarauntid).subscribe((res: any) => {
      this.othersettingsdetails = res._Data;
      this.otherdiningtime = this.othersettingsdetails[0].DiningTime;
      this.seatedService.getSeatedDetails(restarauntid).subscribe((res: any) => {
        this.seatedinfo = res._Data.sort(function (a, b) {
          return a.TableNumbers - b.TableNumbers;
        })
        this.sorted_seatedinfo = this.seatedinfo.sort(function (a, b) {
          return a.HostessID - b.HostessID
        })
        console.log(this.sorted_seatedinfo);

        //        var arr = [];
        //       this.sorted_seatedinfo.map((item,index) => {
        //           this.sorted_seatedinfo.map((item1, index) => {
        //          if (arr.length > 0) {
        //                if (item.TableNumbers == item1.TableNumbers) {                                                      
        //                     let index = arr.findIndex(function(itemdata) {
        //                         return itemdata.HostessID == item1.HostessID;
        //                    })
        //                  if (index >= 0) {
        //                      arr[index] = item1;
        //                  } else {
        //                        arr.push(item); 
        //                     }                        

        //                }
        //                  else {
        //                    arr.push(item);
        //                }
        //              }
        //             else {
        //                 arr.push(item);
        //             }

        //          }) 
        //       })
        //console.log(arr);



        this.sorted_seatedinfo.map((item) => {
          if (item.CheckReceived == "False") {
            item.CheckReceived = false;
          }
          else {
            item.CheckReceived = true;
          }
        })

      });
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  getOpacity(value) {

    if (value.TimeRemaining >= 61) {
      return `0.3`;
    }
    else if (value.TimeRemaining >= 51 && value.TimeRemaining <= 60) {
      return `0.4`;
    }
    else if (value.TimeRemaining >= 41 && value.TimeRemaining <= 50) {
      return `0.5`;
    }
    else if (value.TimeRemaining >= 31 && value.TimeRemaining <= 40) {
      return `0.6`;
    }
    else if (value.TimeRemaining >= 21 && value.TimeRemaining <= 30) {
      return `0.7`;
    }
    else if (value.TimeRemaining >= 11 && value.TimeRemaining <= 20) {
      return `0.8`;
    }
    else if (value.TimeRemaining >= 6 && value.TimeRemaining <= 10) {
      return `0.9`;
    }
    else if (value.TimeRemaining <= 5) {
      return `1`;
    }
    else {
      return {};
    }

  }

  public toggles = [
    { value: 0 },
    { value: 1 }
  ];

  public get(data: any, type: any) {
    var details = {
      "RestaurantID": data['RestaurantID'],
      "TruflUserID": data['TruflUserID'],
      "AmenitiName": type,
      "AmenitiChecked": !data[type]
    }
    this.isenabled = true;
    if (this.items.length) {
      let index = this.items.findIndex(function (item) {
        return item.TruflUserID === data['TruflUserID'] && item.AmenitiName === type;
      });

      if (index >= 0) {
        this.items[index] = details;
      } else {
        this.items.push(details);
      }
    } else {
      this.items.push(details);
    }
  }

  seatedUserDetails(data, index) {
    this.data = data;
    this.bookingid = data.BookingID;
    localStorage.setItem('editguestDetails', JSON.stringify(data));
    this.selectedRow = index;
    this.showProfile = true;
    this.currentSelectedUser = data.Email;
    this.RestaurantId = data.RestaurantID;
    this.username = data.UserName;
    this.pic = data.pic;
    this.profileData = data;
    this.usertype = data.TruflMemberType;
    this.truflid = data.TruflUserID;
    this.restaurantid = data.RestaurantID;
    this.usertype = data.TruflMemberType;
    localStorage.setItem("uniqueid", "seated");

  }

  //print functionality
  printrow(item) {
    this.truflid = item.TruflUserID;
    this.restaurantid = item.RestaurantID;
    this.usertype = item.TruflMemberType;
    this.showProfile = false;
    var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=400,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write('<html><head><title></title>');
    WinPrint.document.write('<link rel="stylesheet" href="assets/css/print.css" media="print" type="text/css"/>');
    WinPrint.document.write('</head><body> <h1>Receipt</h1>');
    var arr = [
      {
        key: "GUEST NAME",
        value: item.UserName
      },
      {
        key: "TRUFL PAYMENT",
        value: item.OfferAmount
      },

      {
        key: "PARTY SIZE",
        value: item.PartySize
      },
      {
        key: "TABLE NUMBER",
        value: item.TableNumbers
      },
      { key: "TIME SEATED", value: item.TimeSeated },
      { key: "TIME REMAINING", value: item.TimeRemaining },
      { key: "SLOW -5MIN", value: '' },
      { key: "JUMP -5MIN", value: '' },
      { key: "CHECK DROP", value: '' },
      { key: "EMPTY TABLE", value: '' },
      { key: "THIS VISIT", value: item.ThisVisit },
      { key: "RELATIONSHIP", value: item.Relationship },
      { key: "SEATING AND PREFERENCES", value: item.SeatingPreferences },
      { key: "FOOD AND DRINK PREFERENCES", value: item.FoodAndDrinkPreferences }

    ];

    WinPrint.document.write('<table>');
    arr.map(function (obj, index) {

      WinPrint.document.write('<tr><th>' + obj.key + '</th><td>' + obj.value + '</td></tr>');


    });

    WinPrint.document.write('</table>');
    WinPrint.document.write('</body>');
    setTimeout(function () {
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }, 1000);
    return false;
  }

  //Functionality for closing side nav
  closeProile() {
    this.showProfile = false;
  }

  editguest() {
    this.seatedService.setEnableEditinfo(true);
    this.router.navigateByUrl('/editguest');
  }


  emptyTable(seatsinfo, bookingid) {
    this.showDialog = !this.showDialog;
    this.emptybookingid = bookingid;
    this.showProfile = false;
    this.truflid = seatsinfo.TruflUserID;
    if (seatsinfo.OfferType === 3) {
      this.billamount = seatsinfo.OfferAmount;
    }
    else {
      this.billamount = null;
    }
    this.rewardtype = 'BILL_AMOUNT';
    this.isempty = "empty";
    this.commonmessage = "Are you sure this table is empty, and you want to remove  " + seatsinfo.TUserName + " from this list? This cannot be undone";
  }

  // empty table post over here
  Ok() {
    if (this.isempty === 'empty') {

      this.seatedService.postUpdateEmptyBookingStatus(this.emptybookingid).subscribe((res: any) => {

        this.statusmessage = res._StatusMessage;
        this.errorcode = res._ErrorCode;
        this.showDialog = !this.showDialog;
        if (this.errorcode === 0) {
          this.getSeatedDetails(this.restarauntid);
          if (this.billamount != null && this.billamount != '') {
            this.seatedService.postPremiumUserdetails(this.truflid, this.restarauntid, this.billamount, this.rewardtype).subscribe((res: any) => {
            });
          }
        }
        else if (this.errorcode === 1) {
          this._toastr.error(this.statusmessage);
        }
      }, (err) => {
        if (err === 0) {
          this._toastr.error('network error')
        }
      })

    }

  }


  /* Function to assign colors to servers. */
  public dummy() {
    /*      this.colorsLoader = true;*/
    var colorsList = '477B6C,8D6C8D,51919A,9A8A4A,9A7047,48588E,919A62,86a873,048ba8,3c6997,bb9f06';
    this.selectstaff.assignServercolor(colorsList, this.restID).subscribe((res: any) => {
      console.log(res);

      for (let i = 0; i < res._Data.length; i++) {
        this.style[res._Data[i].UserID] = {
          "background-color": res._Data[i].backgroundcolor,
          "border": res._Data[i].border,
          "border-radius": res._Data[i].borderradius
        }
      }
      localStorage.setItem("stylesList", JSON.stringify(this.style));
      /*     this.colorsLoader = false;*/
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    });
  }


  Cancel() {
    this.showDialog = !this.showDialog;
  }

  checkDrop(seatinfo, bookingid) {
    seatinfo.CheckReceived = !seatinfo.CheckReceived;
    this.emptybookingid = bookingid;
    this.seatedService.postUpdateCheckReceived(this.emptybookingid).subscribe((res: any) => {
      this.getSeatedDetails(this.restarauntid);


    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })

  }

  slow(seatedinfo, bookingid) {
    seatedinfo.jumpcount = 0;
    this.seatedService.postUpdateExtraTime(bookingid, +5).subscribe((res: any) => {
      this.getSeatedDetails(this.restarauntid);
    })
  }

  jump(seatedinfo, bookingid) {

    this.seatedService.postUpdateExtraTime(bookingid, -5).subscribe((res: any) => {
      this.getSeatedDetails(this.restarauntid);
    })
  }

  //routing
  waitlistPage() {
    this.router.navigateByUrl('/waitlist');
  }

  seatedPage() {
    this.router.navigateByUrl('/seated');
  }

  snapshotPage() {
    this.router.navigateByUrl('/snapshot');
  }

  settingsPage() {
    this.router.navigateByUrl('/defaultSettings');
  }

  public hasData(): boolean {
    return (this.seatedinfo != null && this.seatedinfo.length > 0);
  }

  navigateToaddGuest() {
    localStorage.removeItem("acceptoffer rowdata");
    this.router.navigateByUrl('/addGuest');
  }

  switchtblModal(tblno: any, index: any, template: any) {
    // this.switchUser = true;
    // this.checkDrop = false;
    //  this.emptyTbl = false
    this.serverTblNO = tblno;
    //  this.isDrop[index] = false;
    this.openModal(template);
  }
  public openModal(template) {
    this.modalRef = this.modalService.show(template); // {3}
  }
  dismissmodal() {
    this.modalRef.hide();
  }

  /* function to call service to switch server  */
  switchServer(serverID: any) {

    this.seatedService.switchServer(serverID, this.restID, this.serverTblNO).subscribe((res: any) => {
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (res._StatusMessage == 'Success') {
        // this.loadServerTable();
        //  this.loadCapacityTable();
        //  this.loadServerViseTable();
        this.getSeatedDetails(this.restID);
      }
      else if (this.errorcode === 1) {
        this._toastr.error(this.statusmessage);
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
    this.modalRef.hide();
  }
}
