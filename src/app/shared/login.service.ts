import {Injectable, ViewContainerRef, Inject} from "@angular/core";
import {Http, Response, Headers, RequestOptions, RequestMethod} from '@angular/http';
import {constant} from '../shared/appsettings';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';

@Injectable()
export class LoginService {
  private userType;
  private truflid: any;
  private restaurantid: any;
  private restaurantName;
  private user: {};
  private userName;
  private restaurantTheme;

  constructor(private http: Http,) {

  }

  //getteres and setters
  public setUserType(value) {
    this.userType = value;
    localStorage.setItem('userType', value);
  }

  public getUserType() {
    this.userType = localStorage.getItem('userType');
    return this.userType;
  }

  public setLoggedInUser(value) {
    this.truflid = value;
    localStorage.setItem('LoggedInUser', value);
  }

  public getLoggedInUser() {
    this.truflid = localStorage.getItem('LoggedInUser');
    return this.truflid;
  }

  public setRestaurantId(value) {
    this.restaurantid = value;
    localStorage.setItem('restaurantid', value);
  }

  public getRestaurantId() {
    this.restaurantid = localStorage.getItem('restaurantid');
    return this.restaurantid;
  }

  public setRestaurantName(value) {
    this.restaurantName = value;
    localStorage.setItem('restaurantName', value);
  }

  public getRestaurantName() {
    this.restaurantName = localStorage.getItem('restaurantName');
    return this.restaurantName;
  }

  public setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }

  public setUserName(value) {
    this.userName = value;
    localStorage.setItem('userName', value);
  }

  public getUserName() {
    this.userName = localStorage.getItem('userName');
    return this.userName;
  }
  public setRestaurantTheme(value) {
    this.restaurantTheme = value;
    localStorage.setItem('restaurantTheme', value);
  }

  public getRestaurantTheme() {
    this.restaurantTheme = localStorage.getItem('restaurantTheme');
    return this.restaurantTheme;
  }

  //To get User Details
  getLoginDetails(userstype: any, restaurantid) {
    return this.http.get(constant.truflAPI + constant.truflBase + 'GetUserTypes/' + userstype + '/' + restaurantid).map(
      (res: Response) => res.json()).catch(this.handleError);

  }

  //To get Login Member Type
  loginAuthentication(user: any) {
    this.setUser(user);
    return this.http.post(constant.truflAPI + constant.truflBase + 'LoginAuthentication', user).map(
      (res: Response) => res.json()) .catch(this.handleError);


  }

  //To get an email when click on forgot password
  forgotpassword(email: any) {

    return this.http.get(constant.truflAPI + constant.truflBase + 'ForgetPassword?LoginEmail=' + email).map(
      (res: Response) => res.json()).catch(this.handleError);

  }

  //To reset password
  resetPassword(reset: any) {
    delete reset.confirmPassword;
    return this.http.post(constant.truflAPI + constant.truflBase + 'RestPassword', reset).map(
      (res: Response) => res.json()).catch(this.handleError);

  }

  //To register new user
  create(user: any) {
    return this.http.post(constant.truflAPI + constant.truflBase + 'SignUp', user).map(
      (res: Response) => res.json()).catch(this.handleError);

  }

  /* verifylogin service */


  VerifyLogin(restaurantid) {

    //this.restaurantid = localStorage.getItem('restaurantid');
    return this.http.get(constant.truflAPI + constant.truflBase + 'WaitListUser/GetRestaurantOpenDate/' + restaurantid).map(
      (res) => res.json()
    ).catch(this.handleError);

  }


  /* verifylogin service  end*/

  //To logout
  logout() {
    localStorage.clear();

  }

  public handleError(error: any) {
    return Observable.throw(error.status);
  }


}
