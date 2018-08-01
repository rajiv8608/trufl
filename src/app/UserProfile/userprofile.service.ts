import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { constant } from '../shared/appsettings';
import { Observable } from "rxjs";

@Injectable()
export class UserProfileService {
    public restID: any;

    constructor(private http: Http) {

    }
    /*getUserProfile() {
        this.http.get().map(
            (res) => res.json()
        ).catch(this.handleError)
    }*/

    //Handling errors
    public handleError(error: any) {
        return Observable.throw(error.status)
    }
}



 
