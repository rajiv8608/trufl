import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
@Component({
    selector: 'shared-header',
    templateUrl: './header.Component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    private userType;
    public userName;
    public loadHeaders = {};
    public headers = [];
    public isOpen: boolean = false;
    public isLiactive: boolean = true;
    public isLiSignOut: boolean = false;
    public restaurantName = localStorage.getItem("restaurantName");
   // public restaurantTheme = localStorage.getItem("RestaurantTheme");
    public isRestorantName: boolean = false;

    constructor(private loginService: LoginService, private router: Router) {
        this.userType = this.loginService.getUserType();
        this.userName = this.loginService.getUserName();
       // this.restaurantTheme = this.loginService.getRestaurantTheme();
        this.restaurantName = this.loginService.getRestaurantName();

        if (this.restaurantName == '' || this.restaurantName == 'null') {
            this.isRestorantName = false;
        }
        else {
            this.isRestorantName = true;
        }

        //Keep these load headers in a service-----
        this.loadHeaders = {
            "RA": [

                {
                    "name": "WAITLIST",
                    "active": true,
                    "route": '/waitlist'
                },
                {
                    "name": "SEATED",
                    "active": false,
                    "route": '/seated'
                },
                {

                    "name": "OPEN",
                    "active": false,
                    "route": '/snapshot'
                },
                {

                    "name": "SERVER",
                    "active": false,
                    "route": '/byserver'
                },
                {

                    "name": "SETTINGS",
                    "active": false,
                    "route": '/defaultSettings'
                },


            ],
            "TA": [
                {
                    "name": "Dashboard",
                    "active": true,
                    "route": '/dashboard'
                },
                {
                    "name": "Restaurant",
                    "active": false,
                    "route": '/restaurant'
                },
                {
                    "name": "Settings",
                    "active": true,
                    "route": '/settings'
                }
            ]
        };

        this.headers = this.loadHeaders[this.userType];
        if ((router.url === '/waitlist') || (router.url === '/seated') || (router.url === '/snapshot') || (router.url === '/byserver') || (router.url === '/defaultSettings') || (router.url === '/themesettings')) {
            this.headers.map(function (obj, index) {
                if ([0, 1, 2, 3, 4].indexOf(index) >= 0) {
                    obj.isShow = true;
                } else {
                    obj.isShow = false;
                }
            });
        }

    }
    @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("scroll").style.display = "block";
        } else {
            document.getElementById("scroll").style.display = "none";
        }
    }
    scrollTop() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    myprofile() {
        this.isLiactive = false;
        this.router.navigateByUrl('/myprofile');
    }

    switchUser() {
        this.isLiSignOut = false;
        this.isLiactive = true;
        this.router.navigateByUrl('/login');
    }

    signOut() {
        this.isLiSignOut = true;
        this.isLiactive = false;
        localStorage.setItem('isFromWaitList', 'true');
        this.router.navigateByUrl('/login');


    }

}
