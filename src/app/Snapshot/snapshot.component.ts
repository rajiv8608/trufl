
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from "@angular/router";
import { SnapshotService } from "./Snapshot.Service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StaffService } from '../selectstaff/select-staff.service';
@Component({
  selector: 'snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.css'],
  providers: [SnapshotService, ToastsManager, ToastOptions]
})
export class SnapShotComponent implements OnInit {
  public isCapacitydiv: boolean = true;
  public isServerdiv: boolean = false;
  public isTablediv: boolean = false;
  public CapacityLiast: any = [];
  public ServerWiseList: any = [];
  public TableWiseList: any = [];
  public ServerDetailsList: any = [];
  public isDrop: any = [];
  public tblResLength: any;
  public className: any = [];
  public switchUser: boolean = true;
  public checkDrop: boolean = false;
  public emptyTbl: boolean = false;
  public restID = localStorage.getItem('restaurantid');
  public serverTblNO: any;
  public style;
  private errorcode: any;
  private statusmessage: any;
  public modalRef: BsModalRef;
  /* public ByCapacityTblLoader: boolean = false;
   public ByServerTblLoader: boolean = false;
   public ByTableLoader: boolean = false;
   public ServerListLoader: boolean = false;
   public colorsLoader: boolean = false;*/


  constructor(private router: Router, private _SnapshotService: SnapshotService, private selectstaff: StaffService, private modalService: BsModalService, private _toastr: ToastsManager, vRef: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vRef);
    this.style = JSON.parse(localStorage.getItem("stylesList")) || [];
    console.log(this.style);

    this.isCapacitydiv = true;
    this.isServerdiv = false;
    this.isTablediv = false;
    /*     this.ServerListLoader = true;*/
    this.loadCapacityTable();
    this.loadServerTable();
    this.loadServerViseTable();
    this._SnapshotService.GetServerDetails(this.restID).subscribe(res => {
      this.ServerDetailsList = res._Data.ManageServer;
      /*     this.ServerListLoader = false;*/
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  ngOnInit() {
    if (localStorage.getItem("stylesList") == null) {
      this.dummy();
    }
  }

  public openModal(template) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  /* Load Table wise info. */
  loadServerTable() {
    this.TableWiseList = [];
    /*      this.ByTableLoader = true;*/
    this._SnapshotService.GetTablewiseSnap(this.restID).subscribe(res => {
      if (res._Data.length == 0) {
        this._SnapshotService.emptyResponse(this.restID).subscribe(res => {
          this.errorcode = res._ErrorCode;
          this.statusmessage = res._Data;
          if (this.errorcode == 50000) {
            this._toastr.error(this.statusmessage);
          }
        })
      }
      else {
        /*added code */
        res._Data.forEach((eachObj) => {
          if (eachObj.TableStatus == false) {
            this.TableWiseList.push(eachObj);
          }
        })
        /*added code */
        //  this.TableWiseList = res._Data;
        console.log(this.TableWiseList);

        this.tblResLength = res._Data.length;
        for (let i = 0; i < res._Data.length; i++) {
          if (res._Data[i].TableStatus == true) {
            this.className[i] = 'divBlur divCol2Style cursorPointer';
          }
          else {
            this.className[i] = 'divCol2Style cursorPointer';
          }
        }
        /*       this.ByTableLoader = false;*/
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  /*get capacity wise table info. */
  loadCapacityTable() {
    /*       this.ByCapacityTblLoader = true;*/
    this._SnapshotService.GetCapacitywise(this.restID).subscribe(res => {
      if (res._Data.length == 0) {
        this._SnapshotService.emptyResponse(this.restID).subscribe(res => {
        })
      }
      else {
        this.CapacityLiast = res._Data;
        /*        this.ByCapacityTblLoader = false;*/
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  /* Grt servervise table info. */
  loadServerViseTable() {
    /* this.ByServerTblLoader = true;*/
    this._SnapshotService.GetServerwiseSnap(this.restID).subscribe(res => {
      if (res._Data.length == 0) {
        this._SnapshotService.emptyResponse(this.restID).subscribe(res => {
        })
      }
      else {
        this.ServerWiseList = res._Data;
        /*    this.ByServerTblLoader = false;*/
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  /* Function to make the switch server dropdown show and hide */
  arrFalse(i: any) {
    console.log(i);
    for (let j = 0; j < this.tblResLength; j++) {
      if (i == j) {
        this.isDrop[j] = !this.isDrop[j];
      }
      else {
        this.isDrop[j] = false;
      }
    }
  }

  switchtblModal(tblno: any, index: any, template: any) {
    this.switchUser = true;
    this.checkDrop = false;
    this.emptyTbl = false
    this.serverTblNO = tblno;
    this.isDrop[index] = false;
    this.openModal(template);
  }

  /* function to call service to switch server  */
  switchServer(serverID: any) {

    this._SnapshotService.switchServer(serverID, this.restID, this.serverTblNO).subscribe((res: any) => {
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (res._StatusMessage == 'Success') {
        this.loadServerTable();
        this.loadCapacityTable();
        this.loadServerViseTable();
      }
      else if (this.errorcode === 1) {
        this._toastr.error(this.statusmessage);
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
    this.modalRef.hide();
  }

  dismissmodal() {
    this.modalRef.hide();
  }

  /* function to call service to drop check */
  checkDroped(tblno: any, index: any) {
    this.isDrop[index] = false;
    this.checkDrop = true;
    this.switchUser = false;
    this.emptyTbl = false;

    this._SnapshotService.dropCheck("CHECK", this.restID, tblno).subscribe((res: any) => {
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (res._StatusMessage == 'Success') {
        alert("Ckeck dropped successfuly.");
        this.loadCapacityTable();
        this.loadServerViseTable();
      }
      else if (this.errorcode === 1) {
        this._toastr.error(this.statusmessage);
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  /* function to call service to empty the table */
  emptyTable(tblno: any, index: any) {
    this.isDrop[index] = false;
    this.emptyTbl = true;
    this.switchUser = false;
    this.checkDrop = false

    this._SnapshotService.emptyTable("EMPTY", this.restID, tblno).subscribe((res: any) => {
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (res._StatusMessage == 'Success') {
        this.loadServerTable();
        this.loadCapacityTable();
        this.loadServerViseTable();
      }
      else if (this.errorcode === 1) {
        this._toastr.error(this.statusmessage);
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  /* Function to assign colors to servers. */
  public dummy() {
    console.log("coming");
    /*      this.colorsLoader = true;*/
    var colorsList = '477B6C,8D6C8D,51919A,9A8A4A,9A7047,48588E,919A62,86a873,048ba8,3c6997,bb9f06';
    this.selectstaff.assignServercolor(colorsList, this.restID).subscribe((res: any) => {

      console.log(res);

      for (let i = 0; i < res._Data.length; i++) {
        this.style[res._Data[i].UserID] = {
          "background-color": res._Data[i].backgroundcolor,
          "border": res._Data[i].border,
          "border-radius": res._Data[i].borderradius
        }
      }
      localStorage.setItem("stylesList", JSON.stringify(this.style));
      /*     this.colorsLoader = false;*/
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    });
  }
}
