import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {constant} from '../../shared/appsettings';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class DefineSelectionService {
  private results: any;

  constructor(private http: Http) {
  }

  //get define selections details
  getDefineSelectionDetails(restarauntid) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantSectionTables/' + restarauntid).map(
      (res) => res.json()).catch(this.handleError);

  }

  //post define selctions details
  postDefineSelectionDetails(seatsinfo) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveDefineSections/', seatsinfo).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  //post clock in clock off details
  postClockInClockOutDetails(restarauntid, floornumber, activestatus) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/UpdateRestaurantSectionOpenClose/' + restarauntid + '/' + floornumber + '/' + activestatus, '').map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  //Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }
}
