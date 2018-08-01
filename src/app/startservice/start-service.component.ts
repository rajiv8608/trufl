import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router } from "@angular/router";
import { startService } from "./start-service.service";
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {LoginService} from '../shared/login.service';
@Component({
    selector: 'startService',
    templateUrl: './start-service.component.html',
  providers: [ToastsManager, ToastOptions]

})
export class StartServiceComponent implements OnInit {
  public time: any;
  public showErr: boolean = false;
  private restID = localStorage.getItem('restaurantid');
  private errorcode: any;
  private statusmessage: any;
  public data: any = {};
  public hour: any;
  public minutes: any;
    constructor(private router: Router, private _startService: startService, private _toastr: ToastsManager, vRef: ViewContainerRef,private loginservice:LoginService) {
      this._toastr.setRootViewContainerRef(vRef);

    }

    ngOnInit() {

        /* Service call to load the Start service time. */

            this._startService.GetRestaurantOpenTime(this.restID).subscribe(res => {
              this.statusmessage=res._StatusMessage;
              this.errorcode=res._ErrorCode;
              if(this.errorcode === "0") {
                let resTime = res._Data.RestaurantWaitListOpen[0].OpenTime;
                let val = resTime.split(':');
                let val2 = val[1];
                let minutes = val2.slice(0, 2);
                if (val2.indexOf("A") >= 0) {
                  if (val[0] == '0') {
                    let valtemp = '00';
                    this.time = (valtemp) + ':' + minutes;
                  }
                  else {
                    this.time = (val[0]) + ':' + minutes;
                  }
                }
                else {
                  if (+val[0] == 12) {
                    this.time = (val[0]) + ':' + minutes;
                  }
                  else {
                    this.time = (+val[0] + 12) + ':' + minutes;
                  }
                }
              }
              else if(this.errorcode === "1"){
                this._toastr.error(this.statusmessage);
              }

        },(err) => {if(err === 0){this._toastr.error('network error')}})

    }

    /* Service call to set the selected start service time. */
    public next() {
        debugger;
        if (this.time == "" || this.time == "undefined" || this.time == ":un") {
            this.showErr = true;
        }
        else {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            if (h.toString().length < 2)
            {
              this.hour= ('0' + h).slice(-2);
            }
            else {
                this.hour = h;
            }
            if (m.toString().length < 2) {
              this.minutes = ('0' + m).slice(-2);
            }
            else {
                this.minutes = m;
            }
            var current_time = this.hour + ":" + this.minutes;
            if (current_time > this.time) {
                this.showErr = true;
            }
            else {
                let val = this.time.split(':');
                if (+val[0] < 12) {
                    this.time = val[0] + ':' + val[1] + 'AM';
                }
                else if (+val[0] == 12) {
                    this.time = val[0] + ':' + val[1] + 'PM';
                }
                else {
                    this.time = (+val[0] - 12) + ':' + val[1] + 'PM';
                }

                this.showErr = false;
                this._startService.SaveRestaurantOpenTime(this.restID, this.time).subscribe(res => {
                    this.statusmessage = res._StatusMessage;
                    this.errorcode = res._ErrorCode;
                    if (this.errorcode === 0) {
                        this.router.navigateByUrl('/selectselections');
                    }
                    else if (this.errorcode === 1) {
                        this._toastr.error(this.statusmessage);
                    }
                }, (err) => { if (err === 0) { this._toastr.error('network error') } })
            }
        }
    }

    get() {
        this.time=''
    }
}
