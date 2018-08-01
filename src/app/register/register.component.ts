import {Component, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../shared/login.service';
import {NewUser} from './newUser';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class RegisterComponent {
  public user = new NewUser();
  load: boolean = false;

  constructor(private router: Router, private loginService: LoginService, private _toastr: ToastsManager, vRef: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vRef);
    //called first time before the ngOnInit()

  }

  //SignUp method
  signUp() {


    this.loginService.create(this.user).subscribe((res: any) => {
      window.setTimeout(() => {
        this._toastr.success("Register Successfull");

      }, 500);
      window.setTimeout(() => {
        this.router.navigateByUrl("/login");


      }, 2000);
    })

  }

}
