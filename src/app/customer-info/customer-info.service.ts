import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SharedService } from '../shared/Shared.Service';
import { constant } from '../shared/appsettings';
import { Observable } from "rxjs";

@Injectable()
export class CustomeInfoService {
    public restID: any; 
    constructor(private http: Http, private sharedService: SharedService) {

    } 

    //service for get guest details
    getcustomerinfo(restID:any) {
        return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetTruflCustomer/NEW_BOOKING/' +restID).map(
            (res) => res.json()
        ).catch(this.handleError);
    }

    addnewcustomer(newguestdetails: any) {
        return this.http.post(constant.truflAPI + constant.truflBase + 'WaitListUser/SaveWaitedlistBooking', newguestdetails).map(
            (res) => res.json()
        ).catch(this.handleError);
    }

    //service for get guest details
    geteditcustomerinfo(restID: any) {
        return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetTruflCustomer/EDITBOOKING/' + restID).map(
            (res) => res.json()
        ).catch(this.handleError);
    }    
   
    //Handling errors
    public handleError(error: any) {
        return Observable.throw(error.status);
    }
}
