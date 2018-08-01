import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OtherSettingsService } from '../othersettings/other-settings.service';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/login.service';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { isNumber } from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: 'otherSettings',
  templateUrl: './other-settings.component.html',
  styleUrls: ['./other-settings.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class OtherSettingsComponent implements OnInit {
  private othersettingsdetails;
  private othersettingsdefauktprice;
  private restarauntid;
  public getothersettingsinfo;
  private errorcode: any;
  private statusmessage: any;
  public disablebutton = false;

  constructor(private _otherservice: OtherSettingsService, private router: Router, private _loginservice: LoginService, private _toastr: ToastsManager, vRef: ViewContainerRef, ) {
    this._toastr.setRootViewContainerRef(vRef);
    this.restarauntid = _loginservice.getRestaurantId();
    this.getOtherSelectionsDetails(this.restarauntid);


  }

  ngOnInit() {

  }

  getOtherSelections() {
    this.getothersettingsinfo[0].RestaurantID = +(this.restarauntid);
    let tempObj = {
      RestaurantID: +(this.getothersettingsinfo[0].RestaurantID),
      DiningTime: +(this.getothersettingsinfo[0].DiningTime),
      Geofence: +(this.getothersettingsinfo[0].Geofence),
      TableNowCapacity: +(this.getothersettingsinfo[0].TableNowCapacity),
      DefaultTableNowPrice: +(this.getothersettingsinfo[0].DefaultTableNowPrice),
      MinimumTableNowPrice: +(this.getothersettingsinfo[0].MinimumTableNowPrice),
      RestaurantNotificationMsg: this.getothersettingsinfo[0].RestaurantNotificationMsg,
      MaximumGuests: this.getothersettingsinfo[0].MaximumGuests

    };


    this._otherservice.postOtherSettingsDetails(tempObj).subscribe((res: any) => {
      this.othersettingsdetails = res._Data;
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (this.errorcode === 0) {
        this.router.navigateByUrl('/defaultSettings');
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

  update(value, index) {
    if (isNaN(value) || value == "") {
      this.disablebutton = true;
    }
    else if ((value != "") || (value != null)) {
      this.disablebutton = false;
    }
  }
    updateMessage(value, index) {
        if (!value.match(/^[a-z A-Z]+$/) || value == "") {
            this.disablebutton = true;
        }else {
            this.disablebutton = false;
        }    
    } 
    updateGetTable(value ,index) {
        if (!value.match(/^[24568]|10+$/) || value == "") {
            this.disablebutton = true;
        } else {
            this.disablebutton = false;
        }  
    }  
  getOtherSelectionsDetails(restarauntid) {
    var that = this;
    this._otherservice.getOtherSettingsDetails(restarauntid).subscribe((res: any) => {
        this.getothersettingsinfo = res._Data;    
      this.getothersettingsinfo.map(function (item) {
        let otherinfo = item;
        that._otherservice.setDiningExperience(otherinfo.DiningTime);
        that._otherservice.setDefaultgetaTableprice(otherinfo.DefaultTableNowPrice)

      })

    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    });
    this.othersettingsdefauktprice = this._otherservice.getDefaultgetaTableprice();
  }

  cancel() {
    this.router.navigateByUrl('/defaultSettings');
  }

  savenext() {
    this.getOtherSelections();

  }


}
