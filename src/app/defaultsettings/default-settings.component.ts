import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../shared/login.service';
@Component({
  selector: 'defaultSettings',
  templateUrl: './default-settings.component.html',

})
export class DefaultSettingsComponent {
  public userType: any;

  constructor(private loginService: LoginService,private router: Router) {
    this.userType = this.loginService.getUserType();
  }

 

  defineSection() {
    this.router.navigateByUrl('/defineSelections');
  }

  manageServers() {
    this.router.navigateByUrl('/manageServers');
  }

  otherSettings() {
    this.router.navigateByUrl('/otherSettings');
  }

  waitlistPage() {
    this.router.navigateByUrl('/waitlist');
  }

  seatedPage() {
    this.router.navigateByUrl('/seated');
  }

  snapshotPage() {
    this.router.navigateByUrl('/snapshot');
  }

  settingsPage() {
    this.router.navigateByUrl('/defaultSettings');
  }
  themesettings() {
    this.router.navigateByUrl('/themesettings');
  }
}
