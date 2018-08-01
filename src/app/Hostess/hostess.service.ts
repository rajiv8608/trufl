import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { constant } from '../shared/appsettings';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";

@Injectable()

export class HostessService {
  private rowdata: any = {};
  private premiumdata: any = {};

  constructor(private http: Http) {

  }

  //Service for Users List display
  public getTruflUserList(restarauntid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetWaitListUsers/' + restarauntid)
      .map(res => res.json() || {})
      .catch(this.handleError);
  }

  // service for push notification
  public pushNotification(data: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'Hostess/PushNotification', data).map(
      (res) => res.json()
    )
  }
  //service for empty table
  postUpdateEmptyBookingStatus(bookingid: any) {

    return this.http.post(constant.truflAPI + constant.truflBase + 'Hostess/' + 'UpdateEmptyBookingStatus/' + bookingid, '').map(
      (res) => res.json()
    )
  }

  //getters and setters
  public setRowData(data) {

    this.rowdata = data;
    localStorage.setItem('acceptoffer rowdata', JSON.stringify(data));
  }

  public getRowData() {

    this.rowdata = localStorage.getItem('acceptoffer rowdata');
    return this.rowdata;
  }

  //service for trungetseated
  public getTrungetseated(restarauntid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantGetSeatedNow/' + restarauntid)
      .map(res => res.json() || {})
      .catch(this.handleError);
  }


  public sendmessage(TruflUserID: any) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/SendPushNotification/' + TruflUserID).map(
      (res) => res.json()
    ).catch(this.handleError);
  }


  //changeaccepticontotable

  public changeicon(restarauntid: any, BookingID: any, TruflUserID: any) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateWaitListAccept/' + restarauntid + "/" + BookingID + "/" + TruflUserID).map(
      (res) => res.json()
    ).catch(this.handleError);

  }


  public changeiconpush(restarauntid: any, BookingID: any) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateWaitListNotify/' + restarauntid + "/" + BookingID).map(
      (res) => res.json()
    ).catch(this.handleError);

  }


  //Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }


  //service for premium users
  postPremiumUserdetails(TruflUserID: any, RestaurantID: any, BillAmount: any, RewardType: any) {
    this.premiumdata.TruflUserID = TruflUserID;
    this.premiumdata.RestaurantID = RestaurantID;
    this.premiumdata.BillAmount = BillAmount;
    this.premiumdata.RewardType = RewardType;

    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveRestaurantRewards', this.premiumdata).map(
      (res) => res.json()
    )
  }
  getservers(restID: any) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetServerwiseSnapshot/' + restID).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

}

