import { Component, Input, ViewChild } from '@angular/core';
import { ThemeSettingsComponent } from './defaultsettings/themesetting/themesetting.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  //public selectedItem  any;
  public restaurantTheme = localStorage.getItem("restaurantTheme");

  @ViewChild(ThemeSettingsComponent) child: ThemeSettingsComponent;

  constructor() {
    //console.log(this.restaurantTheme);
  }

  
  //ColorChangedHandler(color: string) {
  //  this.restaurantTheme = color;
  //}

}
