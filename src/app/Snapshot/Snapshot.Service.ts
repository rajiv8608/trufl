import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { constant } from '../shared/appsettings';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";

@Injectable()
export class SnapshotService {
  private results: any;

  constructor(private http: Http) {
  }

  GetCapacitywise(RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetCapacitywiseSnapshot/' + RestaurantID + '').map(
      (res) => res.json()
    ).catch(this.handleError);


  }

  GetServerwiseSnap(RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetServerwiseSnapshot/' + RestaurantID + '').map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  GetTablewiseSnap(RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetTablewiseSnapshot/' + RestaurantID + '').map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  GetServerDetails(RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetRestaurantStaffTables/' + RestaurantID + '').map(
      (res) => res.json()
    ).catch(this.handleError);
  }


  switchServer(serverID, RestaurantID, TblNo) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateSwitchServer/' + RestaurantID + '/' + TblNo + '/' + serverID, {}).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  dropCheck(Dropcheck, RestaurantID, TblNo) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateSnapshotTableEmptyAndCheck/' + RestaurantID + '/' + TblNo + '/' + Dropcheck, {}).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  emptyTable(EmptyTbl, RestaurantID, TblNo) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateSnapshotTableEmptyAndCheck/' + RestaurantID + '/' + TblNo + '/' + EmptyTbl, {}).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  // common service for empty response

  emptyResponse(RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetVerifySnapShot/' + RestaurantID + '').map(
      (res) => res.json()
    )

  }

  //Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }

}
