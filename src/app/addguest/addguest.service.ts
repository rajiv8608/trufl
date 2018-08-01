import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {SharedService} from '../shared/Shared.Service';
import {constant} from '../shared/appsettings';
import {Observable} from "rxjs";

@Injectable()
export class GuestService {
  public restID: any;

  constructor(private http: Http, private sharedService: SharedService) {

  }

//service for adding guest details
  addGuestDetails(guestInfo: any) {

    return this.http.post(constant.truflAPI + constant.truflBase + 'Hostess/SaveRestaurantGuest', guestInfo).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

//service verifying email
  emailverify() {
    return this.http.get(constant.truflAPI + constant.truflBase + 'Hostess/GetVerifyEmailID').map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  //Handling errors
  public handleError(error: any) {
    return Observable.throw(error.status);
  }
}
