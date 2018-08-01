import { Component, ViewContainerRef } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../shared/login.service';
import { UserProfileService } from './userprofile.service';

@Component({
    selector: 'userProfile',
    templateUrl: './userprofile.component.html',
    styleUrls: ['./userprofile.style.css']
    
})
export class UserProfileComponent {
    public userName: any;
    public dayName: any;
    public monthname: any;
    public yearname: any;
   
   
    constructor(private router: Router, private loginService: LoginService, private userProfileService: UserProfileService) {
        this.userName = this.loginService.getUserName();
        var today = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ]
        this.dayName = days[today.getDay()];
        this.monthname = months[today.getMonth()];
        var year = today.getFullYear();
        this.yearname = year.toString().substring(2);
       
    }   

    ngOnInit() {
     /*   this.userProfileService.getUserProfile().subscribe((res) => {
            console.log(res)
        })*/
    }
    cancel() {        
        this.router.navigate(['waitlist']);
    }
}
