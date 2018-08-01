import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { constant } from '../shared/appsettings';

@Injectable()
export class ReservationService {
    constructor(private http: Http) {

    }

    sendreservationdetails(obj: any) {


        return this.http.post(constant.truflAPI + constant.truflBase+'Hostess/SaveRestaurantGuest', obj).map(
            (res) => res.json()
        )

    }




}
