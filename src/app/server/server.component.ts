import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ByServerService } from './server.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/Shared.Service';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    selector: 'byserver',
    templateUrl: './server.component.html',
    styleUrls: ['./server.style.css'],
    providers: [ToastsManager, ToastOptions]
})
export class ByServerComponent implements OnInit {
    public ServerWiseList: any = [];
  public restID = localStorage.getItem('restaurantid');

  public servers_array = [];
  public servers_Data = [];

    constructor(private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef, private byserverService: ByServerService) {
    }

    ngOnInit() {
        this.loadServerViseTable();        
           
    }


    public loadServerViseTable() {
        /* this.ByServerTblLoader = true;*/
        this.byserverService.GetServerwisetable(this.restID).subscribe(res => {
            console.log(res);
             if (res._Data.length == 0) {
                 this.byserverService.emptyResponse(this.restID).subscribe(res => {
                 })
             }
               else {
                 this.ServerWiseList = res._Data;
                // console.log(this.ServerWiseList);
               this.servers_Data = [];
               res._Data.forEach((item) => {
                 this.servers_array.push({
                   "ChecksDropped": item.ChecksDropped,
                   "HostessID": item.HostessID,
                   "HostessName": item.HostessName,
                   "TotalAvaiableSeats": item.TotalAvaiableSeats,
                   "TotalAvailable": item.TotalAvailable,
                   "TotalOccupiedSeats": item.TotalOccupiedSeats,
                   "TotalSeated": item.TotalSeated,
                   "Totalcountseats": item.TotalAvaiableSeats + item.TotalOccupiedSeats,
                   "pic": item.pic,
                   "fewest_active": ((item.TotalOccupiedSeats) / (item.TotalAvaiableSeats + item.TotalOccupiedSeats)) * 100
                 })

               })
               this.servers_Data = this.servers_array.sort(function (a, b) {
                 return a.fewest_active - b.fewest_active;
               })




                 //console.log(res._Data);
   
               }
        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        })

    }
    }





