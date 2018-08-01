import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {ReviewSelectionsService} from './review-selections.service';
import {StaffService} from '../selectstaff/select-staff.service';


import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'reviewSelections',
  templateUrl: './review-selections.component.html',
  styleUrls: ['./review-selections.component.css'],
  providers: [ToastsManager, ToastOptions]

})
export class ReviewSelectionsComponent implements OnInit {
  public review_records: any;
  public RestaurantOpenSections: any;
  public imageIteration: any;
  public RestaurantWaitListOpen: any;
  /*public OpenTimeLoader: boolean = false;*/
  public RestaurantOpenSectionStaff: any;
  public restID = localStorage.getItem('restaurantid');
  public result = [];
  public style = {};
  public errormessage: any;

  constructor(private router: Router, private reviewservice: ReviewSelectionsService, private selectstaff: StaffService, private _toastr: ToastsManager, vRef: ViewContainerRef) {

    this._toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.getReviewSelections(this.restID);
    this.dummy();
  }

//subscribe review selection details here
  public getReviewSelections(restId: any) {
    this.imageIteration = 'data:image/JPEG;base64,'
    this.reviewservice.getreviewdetails(restId).subscribe((res: any) => {
      this.review_records = res._Data;
      this.RestaurantOpenSections = res._Data.RestaurantOpenSection;
      this.RestaurantWaitListOpen = res._Data.RestaurantWaitListOpen;
      this.RestaurantOpenSectionStaff = res._Data.RestaurantOpenSectionStaff;
      let that = this;

      if (this.RestaurantOpenSectionStaff) {
        //adding seatnumbers functionality
        this.RestaurantOpenSectionStaff.map(function (obj) {
          if (that.result.length) {
            var index = that.result.findIndex(function (_obj) {
              return obj.TruflUserID === _obj.TruflUserID;
            });

            if (index !== -1) {
              that.result[index].seatNumbers.push({
                name: 'name',
                type: 'text',
                labelName1: 'Section Start Number',
                labelName2: 'Section End Number',
                StartTableNumber: obj.StartTableNumber,
                EndTableNumber: obj.EndTableNumber
              });
            } else {
              that.result.push(that.getSeatedInfoObj(obj));
            }

          } else {
            that.result.push(that.getSeatedInfoObj(obj));
          }
        })
      }
    })
  }

  getSeatedInfoObj(obj) {
    obj.seatNumbers = [];
    obj.seatNumbers.push({
      name: 'name',
      type: 'text',
      labelName1: 'Section Start Number',
      labelName2: 'Section End Number',
      StartTableNumber: obj.StartTableNumber,
      EndTableNumber: obj.EndTableNumber
    });
    return obj;
  }

  public next() {
    this.errormessage = "an error occured";
    this.reviewservice.UpdateRestaurentOpenDate(this.restID).subscribe((res: any) => {
      if (res._ErrorCode == 1) {
        window.setTimeout(() => {
          this._toastr.error(this.errormessage);
        }, 500);
      } else if (res._ErrorCode == 0) {
        this.router.navigateByUrl('/waitlist');
      }
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  public back() {
    this.router.navigateByUrl('/selectStaff');
  }

//assign colors for selected users
  public dummy() {
    var colorsList = '477B6C,8D6C8D,51919A,9A8A4A,9A7047,48588E,919A62,86a873,048ba8,3c6997,bb9f06';
    this.selectstaff.assignServercolor(colorsList, this.restID).subscribe((res: any) => {
      for (let i = 0; i < res._Data.length; i++) {
        this.style[res._Data[i].UserID] = {
          "background-color": res._Data[i].backgroundcolor,
          "border": res._Data[i].border,
          "border-radius": res._Data[i].borderradius
        }
      }
      localStorage.setItem("stylesList", JSON.stringify(this.style));
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    });
  }
}
