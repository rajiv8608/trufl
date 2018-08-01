import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {constant} from '../../shared/appsettings';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class OtherSettingsService {
  private diningexperience;
  private defaultgettableprice;

  constructor(private http: Http) {
  }

  // setters and getters
  public setDiningExperience(value) {

    this.diningexperience = value;
    localStorage.setItem('diningexperience', value);
  }

  public getDiningExperience() {
    this.diningexperience = localStorage.getItem('diningexperience');
    return this.diningexperience;
  }

  public setDefaultgetaTableprice(value) {
    this.defaultgettableprice = value;
    localStorage.setItem('defaultgettableprice', value);
  }

  public getDefaultgetaTableprice() {
    this.defaultgettableprice = localStorage.getItem('defaultgettableprice');
    return this.defaultgettableprice;
  }

//srevice for getting othersettings details
  getOtherSettingsDetails(restarauntid) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'Admin/GetRestaurantSettings/' + restarauntid).map(
      (res) => res.json()).catch(this.handleError);

  }

//service for posting updated data for other settings
  postOtherSettingsDetails(othersettingsinfo: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'Admin/SaveRestaurantSettings', othersettingsinfo).map(
      (res) => res.json()
    ).catch(this.handleError);
  }

  public handleError(error: any) {
    return Observable.throw(error.status);
  }

}
