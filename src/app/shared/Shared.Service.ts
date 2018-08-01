import {Injectable} from '@angular/core';


@Injectable()
export class SharedService {

  private _guestDetails: object;
  public arraydata: any[] = [];
  public editguest: object;
  public addreservation: object;
  public uniqueid: any;
  public useraccept: object;
  public email_error: any;
  //getters and setters
  get addReservation(): object {

    return this.addreservation
  }

  set addReservation(value: object) {
    this.addreservation = value;
  }

  get guestDetails(): object {
    return this._guestDetails;
  }


  set guestDetails(value: object) {
    this._guestDetails = value;
  }


  get arrayData(): any {
    return this.arraydata;
  }


  set arrayData(value: any) {
    this.arraydata = value;
  }

  get editguestDetails(): object {
    return this.editguest;

  }

  set editguestDetails(value: object) {

    this.editguest = value;
  }


  get userAccept(): object {
    return this.useraccept;
  }

  set userAccept(value: object) {
    this.useraccept = value;
  }

  set uniqueId(value: any) {
    this.uniqueid = value
  }

  get uniqueId(): any {
    return this.uniqueid;
  }


  set emailError(value: any) {
    this.email_error = value
  }

  get emailError(): any {
    return this.email_error;
  }


}

