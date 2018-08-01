import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {StaffService} from "./select-staff.service";
import {SharedService} from '../shared/Shared.Service';
import {LoginService} from '../shared/login.service';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ManageServersService} from "../defaultsettings/manageservers/manage-servers.service";
import {isNumber} from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: 'selectStaff',
  templateUrl: './select-staff.component.html',
  styleUrls: ['./select-staff.style.css'],
  providers: [ToastsManager, ToastOptions]
})
export class SelectStaffComponent implements OnInit {
  private staff_info: any;
  public isShow: boolean = false;
  public selectstaff: any[] = [];
  public status: boolean = false;
  public FloorNumber: any;
  public highlight: any;
  private restarauntid;
  public result = [];
  private currentRowInfo;
  private arr = [];
  private globalCount = 0;
  private listOfRanges = [];
  private savedList: any = [];
  private flag;
  private message;
  private staffinforange;
  public restID: any;
  private errorcode: any;
  private statusmessage: any;
  /*  public staffListLoader: boolean = false;*/
  constructor(private router: Router, private staffService: StaffService, private sharedService: SharedService, private _loginservice: LoginService, private _toastr: ToastsManager, vRef: ViewContainerRef, private _manageserverservice: ManageServersService) {
    this._toastr.setRootViewContainerRef(vRef);
    this.restarauntid = _loginservice.getRestaurantId();
  }

  ngOnInit() {
    this.restID = localStorage.getItem('restaurantid');


    this._loginservice.VerifyLogin(this.restarauntid).subscribe((res: any) => {

      
      if (res._Data === 0) {
        this.getStaffDetails(this.restarauntid);
      }
      else if (res._Data === 1) {
        this.getmanageserversinfo(this.restarauntid);

      }
    })

  }

//subscribe staff details here
  getStaffDetails(restarauntid) {
    var that = this;
    /*this.staffListLoader = true;*/
    this.staffService.getStaffDetails(restarauntid).subscribe((res: any) => {
      this.staff_info = res._Data.SelectStaff;
      this.staffinforange = res._Data.TableRange;
      if (this.staff_info) {
        //adding seatnumbers functionality
        this.staff_info.map(function (obj) {
          if (that.result.length) {
            var index = that.result.findIndex(function (_obj) {
              return obj.TruflUserID === _obj.HostessID;
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
        }, (err) => {
          if (err === 0) {
            this._toastr.error('network error')
          }
        })
      }
      this.result.map(function (obj) {
        obj.sectionsCount = obj.seatNumbers.length;
        obj.seatNumbers.map(function (seatObj) {
          that.globalCount++;
          seatObj['range_' + that.globalCount] = seatObj.StartTableNumber + '-' + seatObj.EndTableNumber;
          seatObj.HostessID = obj.HostessID;
          seatObj.RestaurantID = obj.RestaurantID;
          that.listOfRanges.push({
            ['range_' + that.globalCount]: seatObj['range_' + that.globalCount]
          });
        });
      });
      /*   this.staffListLoader = false;*/
    })
  }

//get manageservers info
  getmanageserversinfo(restarauntid) {
    var that = this;
    /*   this.staffListLoader = true;*/
    this._manageserverservice.getManageServersDetails(this.restarauntid).subscribe((res: any) => {
      this.staff_info = res._Data.ManageServer;
      this.staffinforange = res._Data.TableRange;
      if (this.staff_info) {
        //adding seatnumbers functionality
        this.staff_info.map(function (obj) {
          if (that.result.length) {
            var index = that.result.findIndex(function (_obj) {
              return obj.TruflUserID === _obj.HostessID;
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
        }, (err) => {
          if (err === 0) {
            this._toastr.error('network error')
          }
        })
      }
      this.result.map(function (obj) {
        obj.sectionsCount = obj.seatNumbers.length;
        obj.seatNumbers.map(function (seatObj) {
          that.globalCount++;
          seatObj['range_' + that.globalCount] = seatObj.StartTableNumber + '-' + seatObj.EndTableNumber;
          seatObj.HostessID = obj.HostessID;
          seatObj.RestaurantID = obj.RestaurantID;
          that.listOfRanges.push({
            ['range_' + that.globalCount]: seatObj['range_' + that.globalCount]
          });
        });
      });
      /*     this.staffListLoader = false;*/
    })


  }

  test(num) {
    return !isNaN(num)
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

  back() {
    this.sharedService.arraydata = [];
    this.router.navigateByUrl('/selectselections');
  }

  next() {
    // removing extra parameters for saving
    this.savedList.map(function (obj) {
      delete obj.labelName1;
      delete obj.labelName2;
      delete obj.name;
      delete obj.type;
      Object.keys(obj).filter(function (str) {
        if (str.includes('range')) {
          delete obj[str];
        }
      })
    });

    this.staffService.postStaffDetails(this.savedList).subscribe((res: any) => {
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (this.errorcode === 0) {
        this.router.navigateByUrl('/reviewSelections');
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

//showing user profile side nav
  showProfile(profile, seatArr, index) {
    var _that = this;
    this.currentRowInfo = profile;
    this.currentRowInfo = profile;
    this.currentRowInfo.checked = false;
    if (this.currentRowInfo.ActiveInd == 1) {
      this.currentRowInfo.checked = true;
    }
    this.arr = seatArr;
    this.currentRowInfo.arr = this.arr;
    this.isShow = true;
  }

  addMore() {
    this.globalCount++;
    this.arr.push({
      name: 'name',
      type: 'text',
      StartTableNumber: '',
      EndTableNumber: '',
      labelName1: 'Section Start Number',
      labelName2: 'Section End Number',
      ['range_' + this.globalCount]: ''
    })
    let obj = {
      RestaurantID: this.currentRowInfo.RestaurantID,
      HostessID: this.currentRowInfo.TruflUserID,
      StartTableNumber: this.arr[this.arr.length - 1].StartTableNumber,
      EndTableNumber: this.arr[this.arr.length - 1].EndTableNumber
    };
    this.listOfRanges.push({
      ['range_' + this.globalCount]: ''
    });
  }

  checkIsObjExists(arr, obj) {
    return arr.findIndex(function (_obj) {
      return ((_obj.HostessID === obj.HostessID) && (_obj.StartTableNumber === obj.StartTableNumber) && (_obj.EndTableNumber === obj.EndTableNumber))
    });
  }

  checkInListOfRanges(key) {
    return this.listOfRanges.findIndex(function (range, index) {
      return Object.keys(range)[0] == key;
    });
  }

  CheckRange(findRangeArr) {
    let rangeFunc = (start, end) => Array.from({length: (end - start) + 1}, (v, k) => k + start);
    let rangeArray = findRangeArr.map(function (range) {
      let value = range[Object.keys(range)[0]];
      return rangeFunc(+value.split('-')[0], +value.split('-')[1]);
    });
    return rangeArray;
  }

  updateStartEndLogic(values, index, isStartOrEnd) {
    var _that = this;
    this.currentRowInfo.ActiveInd = 0;
    this.currentRowInfo.checked = false;
    this.result.map(function (value) {
      value.seatNumbers.map(function (seatnumbers) {
        if (seatnumbers.StartTableNumber !== '' && seatnumbers.EndTableNumber !== '' && values !== "") {

          value.ActiveInd = 1;
          _that.currentRowInfo.ActiveInd = 1;

          _that.currentRowInfo.checked = true;
        }
      })
    })
    values = values < 0 ? 0 : values;
    let arrayrange;
    let obj = this.currentRowInfo.arr[index];
    if (obj.StartTableNumber == '' && obj.EndTableNumber == '') {
      this.currentRowInfo.ActiveInd = 0;
      this.currentRowInfo.checked = false;
      this.arr.splice(index, 1);
      if (this.arr != null && this.arr.length != 0) {
        this.currentRowInfo.ActiveInd = 1;
        this.currentRowInfo.checked = true;
      }
    }
    obj.HostessID = this.currentRowInfo.TruflUserID;
    obj.RestaurantID = this.currentRowInfo.RestaurantID;
    let tempArr = Object.keys(obj).filter(function (str) {
      if (str.includes('range')) {
        return str;
      }
    });
    if (tempArr.length) {
      let findedValueIndex = this.checkInListOfRanges(tempArr[0]);
      if (findedValueIndex !== -1) {
        let keyValue = this.listOfRanges[findedValueIndex][tempArr[0]];
        if (keyValue == '') {
          this.listOfRanges[findedValueIndex] = {
            [tempArr[0]]: isStartOrEnd ? (values + '-') : ('-' + values)
          }
        } else {
          if (keyValue.split('-').length === 2) {
            this.listOfRanges[findedValueIndex] = {
              [tempArr[0]]: isStartOrEnd ? (values + '-' + keyValue.split('-')[1]) : (keyValue.split('-')[0] + '-' + values)
            }
          }
        }
      }
    }
    if (this.checkIsObjExists(this.savedList, obj) === -1) {
      this.savedList.push(obj);
    }

    // finding range
    let findRangeArr = this.listOfRanges.filter(function (range) {
      return Object.keys(range)[0] !== tempArr[0];
    });
    arrayrange = this.CheckRange(findRangeArr);
    let that = this;

    this.flag = false;

    arrayrange.map(function (rangeArr) {
      if (obj.StartTableNumber !== '' || obj.EndTableNumber !== '') {
        if (+(obj.StartTableNumber) !== 0 && rangeArr.indexOf(+(obj.StartTableNumber)) !== -1 && that.savedList.length > 1) {
          that.flag = true;
          that.message = "Table already allocated";
        } else if (+(obj.EndTableNumber) !== 0 && rangeArr.indexOf(+(obj.EndTableNumber)) !== -1 && that.savedList.length > 1) {
          that.flag = true;
          that.message = "Table already allocated";
        } else if (+(obj.StartTableNumber) !== 0 && +(obj.EndTableNumber) !== 0 && (+obj.StartTableNumber >= +obj.EndTableNumber)) {
          that.flag = true;
          that.message = "StartTableNumber is Greaterthan EndTableNumber";
        }
        else if ((+(obj.StartTableNumber) < +(that.staffinforange[0].FirstTableNumber) && (obj.StartTableNumber != '')) || (+(obj.EndTableNumber) > +(that.staffinforange[0].LastTableNumber))) {
          that.flag = true;
          that.message = "Exceeded TableRange";
        }
      }
    });
  }

  updateServerStatus(value, index) {
    if (value == false) {
      this.staff_info.ActiveInd = 0;
    }
  }

  updateStartTableNumber(value, index) {
    this.updateStartEndLogic(value, index, true);
  }

  updateEndTableNumber(value, index) {
    this.updateStartEndLogic(value, index, false);
  }

  closeProfile() {
    this.isShow = false;
  }


}
