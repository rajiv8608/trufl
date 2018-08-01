import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {constant} from '../../shared/appsettings';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";


@Injectable()
export class ManageServersService {
  private results: any;

  constructor(private http: Http) {
  }

//service for getting managingservers details
  getManageServersDetails(restarauntid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantStaffTables/' + restarauntid).map(
      (res) => res.json()).catch(this.handleError);
  }

//service for posting the updated data
  postManageserverDetails(seatedinfo: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveManageServer', seatedinfo).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

//service for posting the modal pop up data
  postManageserverModalDetails(restarauntid: any, currentuserid: any, newuserid: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateServerClockOut/' + restarauntid + '/' + currentuserid + '/' + newuserid, '').map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  //Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }
}
