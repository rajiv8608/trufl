import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {constant} from '../shared/appsettings';

import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()

export class TrunongetseatedService {
  private rowdata: any = {}

  constructor(private http: Http) {

  }


  //service for trungetseated tabletypes
  public getTrungetseated(restarauntid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantGetSeatedNow/' + restarauntid)
      .map(res => res.json() || {})
      .catch(this.handleError);
  }

//service for trungetseated getseatsnow
  public postTrungetseatednow(seatedinfo) {

    return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveRestaurantGetSeatedNow', seatedinfo)
      .map(res => res.json() || {})
      .catch(this.handleError);
  }


//Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }

}

