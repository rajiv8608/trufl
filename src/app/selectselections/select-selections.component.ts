import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {SharedService} from '../shared/Shared.Service';
import {SelectService} from './select-sections.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'selectSelections',
  templateUrl: './select-selections.component.html',
  providers: [ToastsManager, ToastOptions]
})
export class SelectSelectionsComponent implements OnInit {
  private array: any[] = [];
  public selections: any;
  public FloorImage: any;
  public data: any[] = [];
  public selectiondata: any;
  public imageIterate: any;
  public image_changes: any[] = [];
  public restID = localStorage.getItem('restaurantid');
  public errormessage: any;

  constructor(private router: Router, private sharedService: SharedService, private selectService: SelectService, private _sanitizer: DomSanitizer, private _toastr: ToastsManager, vRef: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.getDetails(this.restID);
  }

  public getDetails(restID: any) {
    this.selectService.getDetails(restID).subscribe((res: any) => {
      this.selectiondata = res._Data;
      this.sharedService.arraydata.push(this.selectiondata);
      this.selectiondata.forEach((itemdata, index) => {
        if (itemdata.IsActive == false) {
          var obj = {
            "RestaurantID": itemdata.RestaurantID,
            "FloorNumber": itemdata.FloorNumber,
            "FloorName": itemdata.FloorName,
            "image": itemdata.ClosedImage,
            "IsActive": itemdata.IsActive
          }
          this.image_changes.push(obj);
        }
        else {
          var obj = {
            "RestaurantID": itemdata.RestaurantID,
            "FloorNumber": itemdata.FloorNumber,
            "FloorName": itemdata.FloorName,
            "image": itemdata.FloorImage,
            "IsActive": itemdata.IsActive
          }
          this.image_changes.push(obj);
        }
      })
      this.imageIterate = 'data:image/JPEG;base64,'
      this.selections = Object.assign({}, this.selectiondata);
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  public back() {
    this.router.navigateByUrl('/startservice');
  }

  public next() {
    this.errormessage = "an error occured";
    this.selectService.updateselection(this.array).subscribe((res: any) => {

      if (res._ErrorCode == 1) {
        window.setTimeout(() => {
          this._toastr.error(this.errormessage);

        }, 500);


      } else if (res._ErrorCode == 0) {
        this.router.navigateByUrl('/selectStaff');
      }

    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  public select(section, index) {
    this.selectiondata.forEach((item, index) => {
      if (item.FloorNumber == section.FloorNumber && section.IsActive == false) {
        this.image_changes[index].IsActive = !this.image_changes[index].IsActive;
        this.image_changes[index].image = this.selectiondata[index].FloorImage;
        return;
      }

      else {
        if (item.FloorNumber == section.FloorNumber && section.IsActive == true) {
          this.image_changes[index].IsActive = !this.image_changes[index].IsActive;
          this.image_changes[index].image = this.selectiondata[index].ClosedImage;
          return;
        }

      }
    })

    var details = {
      "RestaurantID": section['RestaurantID'],
      "FloorNumber": section['FloorNumber'],
      "IsActive": section['IsActive'],
      "IsDelete": true
    }

    if (this.array.length) {
      let index = this.array.findIndex(function (item) {
        return item.FloorNumber === section.FloorNumber;
      })
      if (index >= 0) {
        this.array[index] = details
      }
      else {
        this.array.push(details);
      }
    }
    else {
      this.array.push(details)
    }

  }

}
