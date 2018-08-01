import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SharedService } from '../shared/Shared.Service';
import { constant } from '../shared/appsettings';
import { Observable } from "rxjs";

@Injectable()
export class ByServerService {
    public restID: any;

    constructor(private http: Http, private sharedService: SharedService) {

    }

  public  GetServerwisetable(RestaurantID) {
        return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetServerwiseSnapshot/' + RestaurantID + '').map(
            (res) => res.json()
        ).catch(this.handleError);
    }  


    // common service for empty response
   public emptyResponse(RestaurantID) {
        return this.http.get(constant.truflAPI + constant.truflBase + '/WaitListUser/GetVerifySnapShot/' + RestaurantID + '').map(
            (res) => res.json()
        )
    }
    //Handling errors
    public handleError(error: any) {
        return Observable.throw(error.status);
    }
}
