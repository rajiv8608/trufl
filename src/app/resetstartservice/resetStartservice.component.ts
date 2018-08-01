/**
 * Created by Sravani on 12/8/2017.
 */

import {Component, ViewContainerRef} from '@angular/core';
import {LoginService} from '../shared/login.service';
import {Router} from '@angular/router';
import{resetStartService} from './resetStartServiceComponent.service';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'resetStartservice',
  templateUrl: './resetStartServiceComponent.html',
  styleUrls: ['./resetStartServiceComponent.css'],
  providers: [ToastsManager, ToastOptions]
})
export class resetStartServiceComponent {
  public restarauntid: any;
  public resetresponse: any;
  private errorcode: any;

  constructor(private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef, public _loginservice: LoginService, private _resetstartservice: resetStartService) {
    this._toastr.setRootViewContainerRef(vRef);
    this.restarauntid = _loginservice.getRestaurantId();

  }

  getResetstartservice() {
    this._resetstartservice.getresetstartservice(this.restarauntid).subscribe((res: any) => {
      this.resetresponse = res._Data;
      this.errorcode = res._ErrorCode;
      if (this.errorcode === "0") {
        this.router.navigateByUrl('/login');
      }

    })
  }

  getResetWaitlist() {
    this._resetstartservice.getResetWaitlistService(this.restarauntid).subscribe((res: any) => {
      this.resetresponse = res._Data;
      this.errorcode = res._ErrorCode;
      if (this.errorcode === "0") {
        /*    this.router.navigateByUrl('/waitlist');*/
      }

    })
  }
}
