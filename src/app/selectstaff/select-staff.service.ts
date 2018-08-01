import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {constant} from '../shared/appsettings';
import {Observable} from "rxjs";

@Injectable()
export class StaffService {
  public RestaurentId: any

  constructor(private http: Http) {

  }

  //service for getting all the alavilabel servers
  getStaffDetails(restaurantid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantSelectStaff/' + restaurantid).map(
      (res) => res.json()
    ).catch(this.handleError)
  }

//service for posting the selected servers
  postStaffDetails(staff_info: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveManageServer', staff_info).map(
      (res) => res.json()
    ).catch(this.handleError)
  }

  //assigning color randomly for alloated sercers
  assignServercolor(colorCodes, RestaurantID) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/AssignColorsToServer/' + colorCodes + '/' + RestaurantID).map(
      (res) => res.json()
    ).catch(this.handleError)
  }

  /* verifylogin service */


  VerifyLogin(restaurantid) {


    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantOpenDate/' + restaurantid).map(
      (res) => res.json()
    ).catch(this.handleError);

  }

  /* verifylogin service  end*/

  //errror handling
  public handleError(error: any) {
    return Observable.throw(error.status);
  }
}
