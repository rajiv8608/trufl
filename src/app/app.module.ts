import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRouting} from './app.routes';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./shared/login.service";
import {AuthGuard} from "./shared/authgaurd.service";
import {SeatedComponent} from "./seated/seated.component";
import {OtherSettingsComponent} from "./defaultsettings/othersettings/other-settings.component";
import {DefaultSettingsComponent} from "./defaultsettings/default-settings.component";
import {ManageServersComponent} from "./defaultsettings/manageservers/manage-servers.component";
import {OtherSettingsService} from "./defaultsettings/othersettings/other-settings.service";
import {ManageServersService} from "./defaultsettings/manageservers/manage-servers.service";
import {HeaderComponent} from "./shared/Header/header.Component";
import {TrunongetseatedService} from "./turnOnGetSeatedNow/trunOngetseated.component.Service";
import {turnOngetseated} from "./turnOnGetSeatedNow/turnOngetseated.component";
import {SeatedService} from "./seated/seated.service";
import {startService} from "./startservice/start-service.service";
import {StartServiceComponent} from "./startservice/start-service.component";
import {ToastModule, ToastsManager, ToastOptions} from "ng2-toastr";
import {HostessService} from "./Hostess/hostess.service";
import {HostessComponent} from "./Hostess/hostess.component";
import {SharedService} from "./shared/Shared.Service";
import {RegisterComponent} from "./register/register.component";
import {SelectService} from "./selectselections/select-sections.service";
import {SelectSelectionsComponent} from "./selectselections/select-selections.component";
import {StaffService} from "./selectstaff/select-staff.service";
import {SelectStaffComponent} from "./selectstaff/select-staff.component";
import {ReviewSelectionsService} from "./reviewselections/review-selections.service";
import {ReviewSelectionsComponent} from "./reviewselections/review-selections.component";
import {SeataguestService} from "./seataguest/seataguest.service";
import {SeataGuestComponent} from "./seataguest/seataguest.component";
import {GuestService} from "./addguest/addguest.service";
import {AddGuestComponent} from "./addguest/addguest.component";
import {EditGuestService} from "./EditGuest/editguest.service";
import {EditGuestComponent} from "./EditGuest/editguest.component";
import {SnapshotService} from "./Snapshot/Snapshot.Service";
import {SnapShotComponent} from "./Snapshot/snapshot.component";
import {ReservationService} from "./Reservation/reservation.service";
import {ReservationComponent} from "./Reservation/reservation.component";
import {DefineSelectionService} from "./defaultsettings/defineselections/define-selections.service";
import {DefineSelectionsComponent} from "./defaultsettings/defineselections/define-selections.component";
import { SPlitStringPipe } from "./Pipes/SnapshotPipe";
import { OrderrByPipe } from "./Pipes/sortByPipe";
import {ModalModule} from 'ngx-bootstrap/modal';
import {EqualValidator} from "./register/password-match.directive";
import {DialogComponent} from "./shared/modal/commonmodal.component";
import{resetStartServiceComponent} from './resetstartservice/resetStartservice.component';
import {resetStartService} from "./resetstartservice/resetStartServiceComponent.service";
import {LoaderComponentComponent} from './loader-component/loader-component.component'
import {LoaderService} from "./loader-component/loader-component.service";
import {httpFactory} from "./shared/http.factory";
import { CustomerInfoComponent } from "./customer-info/customer-info.component";
import { CustomeInfoService } from "./customer-info/customer-info.service";
import { ByServerComponent } from "./server/server.component";
import { ByServerService } from "./server/server.service";
import { ThemeSettingsComponent } from "./defaultsettings/themesetting/themesetting.component";
import { UserProfileComponent } from "./UserProfile/userprofile.component";
import { UserProfileService } from "./UserProfile/userprofile.service";
import { ThemeSettingService } from "./defaultsettings/themesetting/themesetting.service";
import { BsDatepickerModule } from 'ngx-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SeatedComponent,
    OtherSettingsComponent,
    DefaultSettingsComponent,
    ManageServersComponent,
    HeaderComponent,
    turnOngetseated,
    StartServiceComponent,
    HostessComponent,
    RegisterComponent,
    SelectSelectionsComponent,
    SelectStaffComponent,
    ReviewSelectionsComponent,
    SeataGuestComponent,
    AddGuestComponent,
    EditGuestComponent,
    SnapShotComponent,
    ReservationComponent,
    DefineSelectionsComponent,
    SPlitStringPipe,
    EqualValidator,
    DialogComponent,
    resetStartServiceComponent,
    LoaderComponentComponent,
    CustomerInfoComponent,
    OrderrByPipe,
    ByServerComponent,
      ThemeSettingsComponent,
      UserProfileComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ToastModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AppRouting
  ],
  providers: [
    LoginService,
    AuthGuard,
    OtherSettingsService,
    ManageServersService,
    TrunongetseatedService,
    SeatedService,
    startService,
    HostessService,
    SharedService,
    SelectService,
    StaffService,
    ReviewSelectionsService,
    SeataguestService,
    GuestService,
    EditGuestService,
    SnapshotService,
    ReservationService,
    DefineSelectionService,
    ToastsManager,
    ToastOptions,
    resetStartService,
     LoaderService,
    CustomeInfoService,
      ByServerService,
    UserProfileService,
    ThemeSettingService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService]
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
