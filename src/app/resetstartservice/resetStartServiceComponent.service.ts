/**
 * Created by Sravani on 12/8/2017.
 */
import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {constant} from '../shared/appsettings';

import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()

export class resetStartService {
  constructor(private http: Http) {

  }

//resetStartService
  getresetstartservice(restarauntid) {

    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/ResetRestaurantOpenDate/' + restarauntid, '').map(
      (res) => res.json()).catch(this.handleError);

  }

  //resetTimeService
  getResetWaitlistService(restarauntid) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/ResetWaitList/' + restarauntid).map(
      (res) => res.json()).catch(this.handleError);

  }

//Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }

}

