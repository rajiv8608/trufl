
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeSettingService } from './themesetting.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginService } from '../../shared/login.service';

@Component({
  selector: 'themeSettings',
  templateUrl: './themesetting.component.html',
  styleUrls: ['./themeSettings.component.css'],
})
export class ThemeSettingsComponent implements OnInit{
  public restID = localStorage.getItem('restaurantid');
  public themeName: any;
  public restaurantTheme = localStorage.getItem("restaurantTheme");

  @Output() ColorChanged = new EventEmitter();

  constructor(private loginService: LoginService, private router: Router, @Inject(DOCUMENT) document, private themesettingservice: ThemeSettingService, private _toastr: ToastsManager) {
   
  }
  ngOnInit() {

  }
  changeTheme(data) {

    this.loginService.setRestaurantTheme(data);
    document.getElementById('myId').className = data;
    var obj = {
      "RestaurantID": this.restID ,
      "Theme": data
    }
    //this.restaurantTheme = localStorage.getItem("restaurantTheme");
    this.themesettingservice.saveThemeSettings(obj).subscribe(res => {
      console.log(res);
    }, (err) => {
      if (err === 0) {
        this._toastr.error('an error occured')
      }
      });

    this.ColorChanged.emit(data);
  }

}
