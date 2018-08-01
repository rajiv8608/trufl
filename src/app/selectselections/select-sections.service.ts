import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {constant} from '../shared/appsettings';
import {Observable} from "rxjs";
@Injectable()
export class SelectService {
  constructor(private http: Http) {
  }

  //service for getting opensection details
  getDetails(restID: any) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantOpenSections/' + restID).map(
      (res) => res.json()
    ).catch(this.handleError)
  }


//service for posting updated data for opensections
  updateselection(selectiondetails: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateRestaurantActiveSections', selectiondetails).map(
      (res) => res.json()
    ).catch(this.handleError)

  }

  //error handling
  public handleError(error: any) {
    return Observable.throw(error.status);
  }
}
