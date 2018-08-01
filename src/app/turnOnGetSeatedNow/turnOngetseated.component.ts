import { Component, ViewContainerRef } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { TrunongetseatedService } from '../turnOnGetSeatedNow/trunOngetseated.component.Service'
import { OtherSettingsService } from '../defaultsettings/othersettings/other-settings.service'
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'turnOngetseated',
  templateUrl: './turnOngetseated.Component.html',
  styleUrls: ['./turnOngetseated.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class turnOngetseated {
    public isSubmit: boolean = false;
    public isGetSeated: boolean = false;
    private trunongetseatedinfo;
    private tabletype;
    private getseatedinfo;
    private tabledesc;
    private seatedCopy;
    private seatedobject: any = {};
    private restarauntid;
    private othersettingdetails;
    private errorcode: any;
    private statusmessage: any;
    private availableindex;
    private showerror = false;
    private tabletypeofseated;
    private comparedtabletype;
    public isenable;
    public available_tables: any;
    public getseatedinfo_settings: any = [];
    public show_error_priceoutofrange: boolean = false;
    constructor(private _trunongetseated: TrunongetseatedService, private loginService: LoginService, private router: Router, private _othersettingsservice: OtherSettingsService, private _toastr: ToastsManager, vRef: ViewContainerRef, ) {
        this._toastr.setRootViewContainerRef(vRef);
        this.restarauntid = loginService.getRestaurantId();
        var that = this;


        this._othersettingsservice.getOtherSettingsDetails(this.restarauntid).
            subscribe((res: any) => {
                this.othersettingdetails = res._Data;   ///settings value if no data then this should consider
                //   var temp_var = this.othersettingdetails[0].TableNowCapacity;

                //this.tabletype.forEach(item_data => {
                //    if (item_data.TableType == temp_var) {

                //        this.available_tables = item_data.Available;
                //    }
                //})

                this.getseatedinfo_settings = [];

                this.getseatedinfo_settings.push({
                    "OfferAmount": this.othersettingdetails[0].TableNowCapacity * this.othersettingdetails[0].DefaultTableNowPrice,
                    "NumberOfTables": this.othersettingdetails[0].TableNowCapacity,
                    "DefaultTableNowPrice": this.othersettingdetails[0].DefaultTableNowPrice,
                    "DiningTime": this.othersettingdetails[0].DiningTime,
                    "Geofence": this.othersettingdetails[0].Geofence,
                    "MaximumGuests": this.othersettingdetails[0].MaximumGuests,
                    "RestaurantNotificationMsg": this.othersettingdetails[0].RestaurantNotificationMsg,
                    "TableNowCapacity": this.othersettingdetails[0].TableNowCapacity
                });
                this.getseatedinfofromdb();

            }, (err) => {
                if (err === 0) {
                    this._toastr.error('network error')
                }
            });

    }

    getseatedinfofromdb() {
         
        this._trunongetseated.getTrungetseated(this.restarauntid).subscribe((res: any) => {
            this.trunongetseatedinfo = res._Data;
            this.getseatedinfo = null;

            this.tabletype = res._Data.TableType;
            if (this.tabletype != null || this.tabletype.length==0) {
                this.getseatedinfo = res._Data.GetSeatedNow; //db value
               
                 
                if (res._Data.GetSeatedNow == null || res._Data.GetSeatedNow.length == 0) {
                    // console.log(this.getseatedinfo_settings[0].TableNowCapacity);

                    this.getseatedinfo.push({
                        "TableType": this.getseatedinfo_settings[0].TableNowCapacity,
                        "NumberOfTables": this.getseatedinfo_settings[0].NumberOfTables,
                        "OfferAmount": this.getseatedinfo_settings[0].OfferAmount
                    });
                   

                }
                else this.isenable = this.getseatedinfo[0].IsEnabled;
                this.tabletypeofseated = this.getseatedinfo[0].TableType;
                this.comparedtabletype = res._Data.TableType.filter(function (item) {
                    return item.TableType == res._Data.GetSeatedNow[0].TableType;
                });
                this.availableindex = this.tabletype.findIndex(x => x.TableType
                    == this.tabletypeofseated);
                this.seatedobject.TableType = this.getseatedinfo[0].TableType;
                this.seatedobject.NumberOfTables = this.getseatedinfo[0].NumberOfTables;
                this.seatedobject.Amount = "$" + this.getseatedinfo[0].OfferAmount;
                this.seatedCopy = JSON.parse(JSON.stringify(this.tabletype));
                if (this.comparedtabletype.length == 0)
                    this.seatedCopy.push({ "Available": 0 });
                else
                    this.seatedCopy[this.availableindex].Available= this.comparedtabletype[0].Available;
                this.comparedtabletype = this.getseatedinfo.map(function (item) {
                    item.OfferAmount = "$" + item.OfferAmount;
                });
            }
            else {
                //error message no table avaialble
                alert("There are no tables available for selection.")
            }


        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        });





    }

    turngetseated() {
        var that = this;
        this.isenable = false;
        let restarauntid;
        restarauntid = this.loginService.getRestaurantId();
        this.isGetSeated = !this.isGetSeated;
    }
    closeTurngetseated() {
      this.isGetSeated = false;
    }

    tabletypes(value, index) {
        this.availableindex = index;
        this.tabledesc = value.TableTypeDesc;
        this.getseatedinfo[0].NumberOfTables = value.Available;
        this.getseatedinfo[0].TableType = value.TableType;
        this.getseatedinfo[0].OfferAmount = "$" + this.getseatedinfo[0].TableType * this.othersettingdetails[0].DefaultTableNowPrice;
        this.seatedobject.RestaurantID = this.restarauntid;
        this.seatedobject.TableType = this.getseatedinfo[0].TableType;
        this.seatedobject.NumberOfTables = this.getseatedinfo[0].NumberOfTables;
        this.seatedobject.Amount = this.getseatedinfo[0].OfferAmount;
    }

    updateAvailable(value) {
        this.show_error_priceoutofrange = false;         
        if (value <= this.seatedCopy[this.availableindex].Available) {
            this.showerror = false;
            this.seatedobject.NoOfTables = value;
        }
        else {
            this.showerror = true;
           
        }
    }

    updatePrice(value) {
       this.show_error_priceoutofrange = false;
        if (this.getseatedinfo != undefined || this.getseatedinfo != null || this.getseatedinfo != '' ||
            this.getseatedinfo.length != 0) {
            this.isSubmit = false; this.showerror = false; this.show_error_priceoutofrange = false;
            if ((parseInt(this.othersettingdetails[0].MinimumTableNowPrice) *
                (this.getseatedinfo[0].TableType)) >= parseInt(value.replace("$", ""))) {
                this.show_error_priceoutofrange = true;
                this.isSubmit = true;
                this.showerror = true;
            }

            this.getseatedinfo[0].OfferAmount = value;
            this.seatedobject.Amount = value;
        }
         

    }

    addPrice() {
        this.getseatedinfo[0].OfferAmount = +(this.getseatedinfo[0].OfferAmount.toString().replace(new RegExp('\\$', 'g'), ''));
        this.getseatedinfo[0].OfferAmount = this.getseatedinfo[0].OfferAmount + 5;
        this.getseatedinfo[0].OfferAmount = '$' + this.getseatedinfo[0].OfferAmount;
    }

    subPrice() {

        this.getseatedinfo[0].OfferAmount = +(this.getseatedinfo[0].OfferAmount.toString().replace(new RegExp('\\$', 'g'), ''));
        if (this.getseatedinfo[0].OfferAmount > 0) {
            this.getseatedinfo[0].OfferAmount = this.getseatedinfo[0].OfferAmount - 5;

        }
        this.getseatedinfo[0].OfferAmount = '$' + this.getseatedinfo[0].OfferAmount;
    }

    submit() {

        var obj = {
            'RestaurantID': this.restarauntid,
            'TableType': this.getseatedinfo[0].TableType,
            'NoOfTables': this.getseatedinfo[0].NumberOfTables,
            'Amount': +(this.getseatedinfo[0].OfferAmount.toString().replace(new RegExp('\\$', 'g'), '')),
            'IsEnabled': true
        };
        this._trunongetseated.postTrungetseatednow(obj).subscribe((res: any) => {
            this.statusmessage = res._StatusMessage;
            this.errorcode = res._ErrorCode;

            if (this.errorcode === 0) {
                this.isSubmit = !this.isSubmit;
                this.seatedobject.RestaurantID = this.restarauntid;
                this.seatedobject.TableType = this.getseatedinfo[0].TableType;
                this.seatedobject.NumberOfTables = this.getseatedinfo[0].NumberOfTables;
                this.seatedobject.Amount = this.getseatedinfo[0].OfferAmount;
            }
            else if (this.errorcode === 1) {
                this._toastr.error(this.statusmessage);
            }

        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        });

    }
    cancel() {

        var obj = {
            'RestaurantID': this.restarauntid,
            'TableType': this.getseatedinfo[0].TableType,
            'NoOfTables': this.getseatedinfo[0].NumberOfTables,
            'Amount': +(this.getseatedinfo[0].OfferAmount.toString().replace(new RegExp('\\$', 'g'), '')),
            'IsEnabled': false
        };
        this._trunongetseated.postTrungetseatednow(obj).subscribe((res: any) => {

            this.statusmessage = res._StatusMessage;
            this.errorcode = res._ErrorCode;

            if (this.errorcode === 0) {
                this.isSubmit = false;
                this.isenable = false;
                this.isGetSeated = false;


            }
            else if (this.errorcode === 1) {
                this._toastr.error(this.statusmessage);
            }

        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        });

    }
}
