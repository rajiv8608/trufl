import {Injectable} from "@angular/core";
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import {constant} from '../shared/appsettings';
import {Observable} from "rxjs";

@Injectable()
export class EditGuestService {
  constructor(private http: Http) {

  }


  editGuestDetails(guestInfo: any, number: any) {

    if (number == 1) {
      return this.http.post(constant.truflAPI + constant.truflBase + 'Hostess/UpdateRestaurantGuest', guestInfo).map(
        (res) => res.json()
      ).catch(this.handleError);

    }
    else {
      return this.http.post('', guestInfo).map(
        (res) => res.json()
      ).catch(this.handleError);
    }


  }


  public geteditguestdetails(restaurentid: any, userid: any, usertype: any) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'Hostess/GetRestaurantGuest/' + restaurentid + '/' + userid + '/' + usertype).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

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
