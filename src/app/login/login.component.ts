import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/login.service';
import { User } from './user';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [ToastsManager, ToastOptions]
})
export class LoginComponent {
    private user = new User();
    public showForgotPassword = false;
    public showResetPassword = false;
    public showlogin = true;
    private email;
    private loginDetails: any;
    private emailDetails;
    private returnUrl;
    private reset: any = {};
    public showReset: boolean = false;
    private errorcode: any;
    private statusmessage: any;
    private restarauntid;


    constructor(private loginService: LoginService, private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef, private route: ActivatedRoute) {
        this._toastr.setRootViewContainerRef(vRef);
        this.user.usertype = "RA";
        localStorage.removeItem('isLogin');
        //called first time before the ngOnInit()

    }

    ngOnInit() {

    }

    register() {
        this.router.navigateByUrl('/register');
    }

    //login
    signIn() {
        localStorage.removeItem('isAnyTab');
        localStorage.removeItem('isFromWaitList');
        localStorage.setItem('isLogin', 'true');
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.loginService.setUserType(this.user.usertype);
        if (this.user.usertype === null) {
            window.setTimeout(() => {
                this._toastr.error("Please Select UserType");

            }, 500);
        }


        this.loginService.setUserType(this.user.usertype);
        this.loginService.loginAuthentication(this.user).subscribe((res: any) => {

            this.errorcode = res._ErrorCode;
            this.statusmessage = res._StatusMessage;
            this.reset.UserEmail = this.user.emailid;
            if (this.errorcode === 0) {
                res._Data.map((item: any) => {
                    this.loginDetails = item;
                    console.log(this.loginDetails);
                    this.loginService.setLoggedInUser(this.loginDetails.TruflUSERID);
                    this.loginService.setRestaurantId(this.loginDetails.RestaurantID);
                    this.loginService.setRestaurantName(this.loginDetails.RestaurantName);
                    this.loginService.setUserName(this.loginDetails.FullName);
                    this.loginService.setRestaurantTheme(this.loginDetails.RestaurantTheme);
                    if (this.loginDetails.ForgetPasswordStatus) {

                        this.showResetPassword = true;
                        this.showForgotPassword = false;
                        this.showlogin = false;
                        this.showReset = true;
                    }
                    /*verifylogin*/
                    else {
                        this.restarauntid = this.loginService.getRestaurantId();

                        this.loginService.VerifyLogin(this.restarauntid).subscribe((res: any) => {


                            if (res._Data === 0) {
                                this.router.navigateByUrl('/startservice');

                            }
                            else if (res._Data === 1) {
                                this.router.navigateByUrl('/waitlist');

                            }
                        })

                    }
                        /*verifylogin end */
                    });
            
        }
      else if (this.errorcode === 1) {
            this._toastr.error(this.statusmessage);
        }
        if (this.loginDetails) {

            if (this.loginDetails.TruflMemberType === "RA ") {
                if (this.loginDetails.ForgetPasswordStatus) {
                    this.ResetPasswordShow();
                }


            }
            else if (this.loginDetails.TruflMemberType === "TA ") {
                if (this.loginDetails.ForgetPasswordStatus) {
                    this.ResetPasswordShow();
                }


            }
        }
        else if (this.errorcode === 50000) {
            window.setTimeout(() => {
                this._toastr.error(this.statusmessage);

            }, 500);

        }


    }, (err) => {
        if (err === 0) {
            this._toastr.error('network error')
        }
    });


  }

showOnlyLogin() {
    this.user = new User();
    this.showResetPassword = false;
    this.showForgotPassword = false;
    this.showlogin = true;
    this.showReset = false;
}

showLogin() {
    this.user = new User();
    this.showResetPassword = false;
    this.showForgotPassword = false;
    this.showlogin = false;
    this.showReset = true;
    
}

//Forgot Password
forgotPasswordShow() {
    this.showlogin = false;
    this.showResetPassword = false;
    this.showForgotPassword = true;
    this.showReset = false;
}

forgotPasswordImpl() {
    this.showlogin = false;
    this.showForgotPassword = false;
    this.showResetPassword = true;
    this.loginService.forgotpassword(this.email).subscribe((res: any) => {
        res._Data.map((item: any) => {
            this.emailDetails = item;
        });

    }, (err) => {
        if (err === 0) {
            this._toastr.error('network error')
        }
    });

}

//Reset Password
ResetPasswordShow() {
    this.showlogin = false;
    this.showResetPassword = false;
    this.showForgotPassword = false;
    this.showReset = true;
}

resetPasswordImpl() {
   

    this.loginService.resetPassword(this.reset).subscribe((res: any) => {
       
            this._toastr.success("Password changed successfully");
            this.showlogin = true;
            this.reset.confirmPassword = this.reset.NewLoginPassword;
            this.reset.NewLoginPassword = ""; this.reset.confirmPassword = "";
            this.showReset = false;
            this.user.emailid = '';
            this.user.password = '';
            this.user.usertype = '';
    }, (err) => {
        if (err === 0) {
            this._toastr.error('network error')
        }
    })
}

}
