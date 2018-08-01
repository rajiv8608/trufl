import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { constant } from '../../shared/appsettings';
import { Observable } from "rxjs";

@Injectable()
export class ThemeSettingService {
  constructor(private http: Http) {

  }
  saveThemeSettings(data: any) {   
    return this.http.post(constant.truflAPI + constant.truflBase + 'Hostess/SaveTheme', data).map(
        (res) => res.json()
      )
  }
};
