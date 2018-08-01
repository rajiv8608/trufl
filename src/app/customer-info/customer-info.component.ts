import {OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { ToastOptions } from 'ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, ViewContainerRef } from '@angular/core';
import { CustomeInfoService } from './customer-info.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class CustomerInfoComponent implements OnInit {

    public newCustDiv: boolean;
    public addOfferAmnt: boolean;
    public customer_details: any;
    public restID = localStorage.getItem('restaurantid');
    public data: any = {};
    public value: any;    
    public restaurentid: any;
    public LoggedInUser = localStorage.getItem('LoggedInUser');
    public OfferType: any;
    public amount: any
    public TranType: any = "WAITLIST";

    /* edit customer */
    public edit_customer: any;
    public edit_GetTableNow: any;
    public BookingID: number = 0;
    public edit_object: any = [];
    public PartySize: any;
    public OfferAmount: any;
    public Quoted: any;
    public edit_offerType: any
    public TableType: any;
    public edit_TableNowAmount: any;
    public final_TableNowAmount: any;
    public enable_seated: any;
    public Table_type: any;
    public edit_status: any;
    public add_status: any
    public GetTableNowType: any;

      /* edit customer end*/

    constructor(private router: Router, private _toastr: ToastsManager, vRef: ViewContainerRef, public _loginservice: LoginService, public customeInfoService: CustomeInfoService) {

        this._toastr.setRootViewContainerRef(vRef);
        this.newCustDiv = true;
        this.addOfferAmnt = true;
    }

    ngOnInit() {
        this.get_information();      
    }

    public get_information() {
        this.customeInfoService.getcustomerinfo(this.restID).subscribe((res: any) => {
            this.customer_details = res._Data.BookingDetails;
            console.log(res);
            if (typeof res._Data.GetSeatedNow[0] !== 'undefined' && res._Data.GetSeatedNow[0] !== null) {
                this.enable_seated = res._Data.GetSeatedNow[0].IsEnabled;
                this.TableType = res._Data.GetSeatedNow[0].TableType;
                this.edit_TableNowAmount = res._Data.GetSeatedNow[0].OfferAmount;                
            }
            this.amount = res._Data.RestSettings[0].DefaultTableNowPrice;          

        }, (err) => {
            if (err === 0) {
                this._toastr.error('network error')
            }
        }) 

    }

    onRadioClicked(event, form: NgForm) {
        form.resetForm();
        this.edit_offerType = 0;
       
      if (event.target.value === 'newCust') {
          this.get_information();
          this.newCustDiv = true;
          this.TranType = "WAITLIST";
          this.BookingID = 0;
      }
      else {          
          this.newCustDiv = false;      
          this.customeInfoService.geteditcustomerinfo(this.restID).subscribe((res: any) => {            
              this.edit_customer = res._Data.BookingDetails;                
              this.edit_GetTableNow = res._Data.GetSeatedNow;       

          }, (err) => {
              if (err === 0) {
                  this._toastr.error('network error')
              }
          })

      }
  }

  onRadioCustAddClicked(event) {
      if (event.target.value === 'addWaitlist') {
          this.addOfferAmnt = true;
          this.TranType = "WAITLIST";
      }
      else if (event.target.value ==='makeOffer') {
          this.addOfferAmnt = false;
          this.TranType = "MAKEANOFFER";
      }
      else if (event.target.value === 'getTbl') {
          this.TranType = "GETTABLENOW";

      }

  }

  update(value: any) {     
      if (this.addOfferAmnt == false) {
          this.data.OfferAmount = parseInt(value) * this.amount;
          if (isNaN(this.data.OfferAmount)) {
              this.data.OfferAmount = '';
          }
      }

      if (value > this.TableType) {
          this.add_status = true;         
      }
      else {
          this.add_status = false; 
      }     
    
  }
  onChange(event: any) {     
      let index = this.edit_customer.findIndex(function (item) {
          return item.BookingID === parseInt(event);
      })   
     
      this.PartySize = this.edit_customer[index].PartySize;   
      this.OfferAmount = this.edit_customer[index].OfferAmount;
      this.Quoted = this.edit_customer[index].Quoted;
      this.edit_offerType = this.edit_customer[index].OfferType;    

      this.BookingID = this.edit_customer[index].BookingID;
      if (typeof this.edit_GetTableNow[0] !== 'undefined' && this.edit_GetTableNow[0] !== null) {
          this.TableType = this.edit_GetTableNow[0].TableType;
          this.edit_TableNowAmount = this.edit_GetTableNow[0].OfferAmount;
      }     

      if (this.TableType<this.PartySize) {
          this.edit_status = true;
      } else {
          this.edit_status = false;
      }
     
  }
    
  onSubmit(customer_info: any, form: NgForm) {    
      if (this.TranType == "MAKEANOFFER") {
          this.OfferType = 3;
          this.GetTableNowType = 0;
      }
      else if (this.TranType == "WAITLIST") {
          this.OfferType = 4;
          this.GetTableNowType = 0;
      }
      else if (this.TranType == "GETTABLENOW") {
          this.OfferType = 5;
          customer_info.Quoted = 0;
          this.GetTableNowType =customer_info.TableType;
          customer_info.OfferAmount = customer_info.edit_TableNowAmount;
      }
           
      if (customer_info.OfferAmount === null || customer_info.OfferAmount === undefined) {
          customer_info.OfferAmount = 0;
      }
     
      if (customer_info.TruflUserCardDataID === null || customer_info.TruflUserCardDataID === undefined) {
          customer_info.TruflUserCardDataID =0
      }

      if (customer_info.TruflTCID === null || customer_info.TruflTCID === undefined) {
          customer_info.TruflTCID =0
      }
      
      if (customer_info.Quoted === null || customer_info.Quoted === undefined) {
          customer_info.Quoted = 0
      }

      if (customer_info.TruflUserID === null || customer_info.TruflUserID === undefined) {
          customer_info.TruflUserID = 0
      }
    
      if (customer_info.TruflUserID) {
          customer_info.TruflUserID = JSON.parse(customer_info.TruflUserID)
      }

      if (this.restID) {
          this.restaurentid = JSON.parse(this.restID);
      }
      if (this.LoggedInUser) {
          this.LoggedInUser = JSON.parse(this.LoggedInUser);
      }
      
      if (customer_info.PartySize) {
          customer_info.PartySize = JSON.parse(customer_info.PartySize)
      }

      if (customer_info.Quoted) {
          customer_info.Quoted = JSON.parse(customer_info.Quoted)
      }
      if (customer_info.OfferAmount) {
          customer_info.OfferAmount = JSON.parse(customer_info.OfferAmount)
      }      

      if (customer_info.PartySize === null || customer_info.PartySize === undefined) {
          customer_info.PartySize  =""
      }

      if (customer_info.Quoted === null || customer_info.Quoted === undefined) {
          customer_info.Quoted =""
      }     

      //  GetTableNowType:
      let obj = {
          BookingID: this.BookingID,
          TruflUserID: customer_info.TruflUserID,
          RestaurantID: this.restaurentid,
          PartySize: customer_info.PartySize,
          OfferType: this.OfferType,
          OfferAmount: customer_info.OfferAmount,
          Quoted: customer_info.Quoted,    
          BookingStatus: 2,    
          LoggedInUser: this.LoggedInUser,
          GetTableNowType: this.GetTableNowType
        
      };
    
      this.customeInfoService.addnewcustomer(obj).subscribe((res: any) => {        
        
          if (res._ErrorCode == '1') {
              window.setTimeout(() => {
                  this._toastr.error("error occured");

              }, 500);
          }
          else if (res._ErrorCode == '0') {
              this._toastr.success("Record saved successfully");
          }          

      }, (err) => {
          if (err === 0) {
              this._toastr.error('network error')
          }

      })

    }
 
}
