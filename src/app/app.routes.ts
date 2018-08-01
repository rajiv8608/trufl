import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {SeatedComponent} from "./seated/seated.component";
import {AuthGuard} from "./shared/authgaurd.service";
import {HostessComponent} from "./Hostess/hostess.component";
import {RegisterComponent} from "./register/register.component";
import {StartServiceComponent} from "./startservice/start-service.component";
import {SelectSelectionsComponent} from "./selectselections/select-selections.component";
import {SelectStaffComponent} from "./selectstaff/select-staff.component";
import {ReviewSelectionsComponent} from "./reviewselections/review-selections.component";
import {DefineSelectionsComponent} from "./defaultsettings/defineselections/define-selections.component";
import {ManageServersComponent} from "./defaultsettings/manageservers/manage-servers.component";
import {OtherSettingsComponent} from "./defaultsettings/othersettings/other-settings.component";
import {DefaultSettingsComponent} from "./defaultsettings/default-settings.component";
import {SeataGuestComponent} from "./seataguest/seataguest.component";
import {AddGuestComponent} from "./addguest/addguest.component";
import {EditGuestComponent} from "./EditGuest/editguest.component";
import {SnapShotComponent} from "./Snapshot/snapshot.component";
import {ReservationComponent} from "./Reservation/reservation.component";
import {resetStartServiceComponent} from "./resetstartservice/resetStartservice.component";
import { CustomerInfoComponent } from "./customer-info/customer-info.component";
import { ByServerComponent } from "./server/server.component";
import { ThemeSettingsComponent } from "./defaultsettings/themesetting/themesetting.component";
import { UserProfileComponent } from "./UserProfile/userprofile.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'seated', component: SeatedComponent, canActivate: [AuthGuard]},
  {path: 'waitlist', component: HostessComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'startservice', component: StartServiceComponent, canActivate: [AuthGuard]},
  {path: 'selectselections', component: SelectSelectionsComponent, canActivate: [AuthGuard]},
  {path: 'selectStaff', component: SelectStaffComponent, canActivate: [AuthGuard]},
  {path: 'reviewSelections', component: ReviewSelectionsComponent, canActivate: [AuthGuard]},
  {path: 'defineSelections', component: DefineSelectionsComponent, canActivate: [AuthGuard]},
  {path: 'manageServers', component: ManageServersComponent, canActivate: [AuthGuard]},
  {path: 'otherSettings', component: OtherSettingsComponent, canActivate: [AuthGuard]},
  {path: 'defaultSettings', component: DefaultSettingsComponent, canActivate: [AuthGuard]},
  {path: 'seataGuest', component: SeataGuestComponent, canActivate: [AuthGuard]},
  {path: 'addGuest', component: AddGuestComponent, canActivate: [AuthGuard]},
  {path: 'editguest', component: EditGuestComponent, canActivate: [AuthGuard]},
  {path: 'snapshot', component: SnapShotComponent, canActivate: [AuthGuard]},
  {path: 'reservation', component: ReservationComponent, canActivate: [AuthGuard]},
  { path: 'resetstartservice', component: resetStartServiceComponent, canActivate: [AuthGuard] },
  { path: 'CustomerInfo', component: CustomerInfoComponent, canActivate: [AuthGuard] },
  { path: 'byserver', component: ByServerComponent, canActivate: [AuthGuard] },
    { path: 'themesettings', component: ThemeSettingsComponent, canActivate: [AuthGuard] },
    { path: 'myprofile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {path: '**', redirectTo: 'login'},
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
