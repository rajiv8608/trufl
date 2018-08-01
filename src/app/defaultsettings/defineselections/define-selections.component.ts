import {Component, ViewContainerRef} from '@angular/core';
import {DefineSelectionService} from '../defineselections/define-selections.service';
import {LoginService} from '../../shared/login.service';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Router} from '@angular/router';
import {isNumber} from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: 'defineSelections',
  templateUrl: './define-selections.component.html',
  styleUrls: ['./define-selections.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class DefineSelectionsComponent {
  private defineselectionsdetails;
  private definesectionstablerange;
  private restarauntid;
  public result = [];
  private arr = [];
  public isShow: boolean = false;
  private currentRowInfo;
  private savedList: any = [];
  private flag;
  private message;
  private savedseatedinfo;
  private globalCount = 0;
  private listOfRanges = [];
  private activestatus;
  private floornumber;
  private clockinoutinfo;
  private errorcode: any;
  private statusmessage: any;


  constructor(private _defineservice: DefineSelectionService, private router: Router, private _loginservice: LoginService, private _toastr: ToastsManager, vRef: ViewContainerRef,) {
    this.restarauntid = _loginservice.getRestaurantId();

    this._toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.getDefineSelections(this.restarauntid);
  }

//subscribe defineselections in this function
  getDefineSelections(restarauntid) {
    var that = this;

    this._defineservice.getDefineSelectionDetails(restarauntid).subscribe((res: any) => {
      this.defineselectionsdetails = res._Data.DefineSection;
      this.definesectionstablerange = res._Data.TableRange;
      if (this.defineselectionsdetails) {
        //adding seatnumbers functionality

        this.defineselectionsdetails.map(function (obj) {

          if (that.result.length) {
            var index = that.result.findIndex(function (_obj) {
              return obj.FloorNumber === _obj.FloorNumber;
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

      this.result.map(function (obj) {
        obj.sectionsCount = obj.seatNumbers.length;
        obj.seatNumbers.map(function (seatObj) {
          that.globalCount++;
          seatObj['range_' + that.globalCount] = seatObj.StartTableNumber + '-' + seatObj.EndTableNumber;
          seatObj.FloorNumber = obj.FloorNumber;
          seatObj.RestaurantID = obj.RestaurantID;
          that.listOfRanges.push({
            ['range_' + that.globalCount]: seatObj['range_' + that.globalCount]
          });

          if (seatObj.StartTableNumber !== '' && seatObj.EndTableNumber !== '') {
            that.savedList.push(seatObj);
          }
        });
      });

    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  cancel() {
    this.router.navigateByUrl('/defaultSettings');
  }

//checking whether entered number is within the range functionality
  CheckRange(findRangeArr) {
    let rangeFunc = (start, end) => Array.from({length: (end - start) + 1}, (v, k) => k + start);
    let rangeArray = findRangeArr.map(function (range) {
      let value = range[Object.keys(range)[0]];
      return rangeFunc(+value.split('-')[0], +value.split('-')[1]);
    });
    return rangeArray;
  }

  saveclose() {
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

    this.postsavedlist();
  }

//calling service for posting the update data of table numbers
  postsavedlist() {
      this._defineservice.postDefineSelectionDetails(this.savedList).subscribe((res: any) => {
      this.savedseatedinfo = res._Data;
      this.statusmessage = res._StatusMessage;
      this.errorcode = res._ErrorCode;
      if (this.errorcode === 0) {
        this.router.navigateByUrl('/defaultSettings');
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

//displaying details in sidenav
  showProfile(profile, seatArr, index) {

    var _that = this;
    this.floornumber = profile.FloorNumber;
    this.currentRowInfo = profile;
    this.arr = seatArr;
    this.currentRowInfo.arr = this.arr;

    this.isShow = true;
  }

//updateing server status clock in clock off
  updateServerStatus(value, index) {

    this.defineselectionsdetails.IsActive = value;
    if (value == false) {
      this.activestatus = this.defineselectionsdetails.ActiveInd = 0;
    }
    else {
      this.activestatus = this.defineselectionsdetails.ActiveInd = 1;
    }

    this._defineservice.postClockInClockOutDetails(this.restarauntid, this.floornumber, this.activestatus).subscribe((res: any) => {
      this.clockinoutinfo = res._Data;
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
  }

  closeProile() {
    this.isShow = false;
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
      FloorNumber: this.currentRowInfo.FloorNumber,
      StartTableNumber: this.arr[this.arr.length - 1].StartTableNumber,
      EndTableNumber: this.arr[this.arr.length - 1].EndTableNumber
    };


    this.listOfRanges.push({
      ['range_' + this.globalCount]: ''
    });


  }

  checkIsObjExists(arr, obj) {
    return arr.findIndex(function (_obj) {
      return ((_obj.FloorNumber === obj.FloorNumber) && (_obj.StartTableNumber === obj.StartTableNumber) && (_obj.EndTableNumber === obj.EndTableNumber))
    });
  }

  checkInListOfRanges(key) {
    return this.listOfRanges.findIndex(function (range, index) {
      return Object.keys(range)[0] == key;
    });

  }


  test(num) {
    return !isNaN(num)
  }

  updateStartEndLogic(value, index, isStartOrEnd) {
    let arrayrange;
    let obj;
    obj = this.currentRowInfo.arr[index];
    if (obj.StartTableNumber == '' && obj.EndTableNumber == '') {

      this.currentRowInfo.IsActive = false;
      this.arr.splice(index, 1);
      if (this.arr != null && this.arr.length != 0) {

        this.currentRowInfo.IsActive = true;
      }
    }
    obj.FloorNumber = this.currentRowInfo.FloorNumber;
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
            [tempArr[0]]: isStartOrEnd ? (value + '-') : ('-' + value)
          }
        } else {
          if (keyValue.split('-').length === 2) {
            this.listOfRanges[findedValueIndex] = {
              [tempArr[0]]: isStartOrEnd ? (value + '-' + keyValue.split('-')[1]) : (keyValue.split('-')[0] + '-' + value)
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
        else if ((+(obj.StartTableNumber) < +(that.definesectionstablerange[0].FirstTableNumber) && (obj.StartTableNumber != '')) || (+(obj.EndTableNumber) > +(that.definesectionstablerange[0].LastTableNumber))) {
          that.flag = true;
          that.message = "Exceeded TableRange";
        }
      }


    });

  }

  updateStartTableNumber(value, index) {
    this.updateStartEndLogic(value, index, true);


  }

  updateEndTableNumber(value, index) {

    this.updateStartEndLogic(value, index, false);
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

}


