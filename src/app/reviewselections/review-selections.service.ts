import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {constant} from '../shared/appsettings';
import {Observable} from "rxjs";

@Injectable()
export class ReviewSelectionsService {
  public RestaurantID: any;

  constructor(private http: Http) {

  }

  //service for getting review selection details
  getreviewdetails(restId: any) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantWaitTimeOpenSectionStaff/' + restId).map(
      (res) => res.json()
    ).catch(this.handleError)
  }

  //service for updating restaraunt date
  UpdateRestaurentOpenDate(restId: any) {
    // this.RestaurantID = 1;
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateRestaurantOpenDate/' + restId, {}).map(
      (res) => res.json()
    ).catch(this.handleError)
  }

//error handling
  public handleError(error: any) {
    return Observable.throw(error.status);
  }

}
