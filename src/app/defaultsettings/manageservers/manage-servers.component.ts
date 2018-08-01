import {Component, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {ManageServersService} from '../manageservers/manage-servers.service';
import {LoginService} from '../../shared/login.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastOptions} from 'ng2-toastr';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {StaffService} from '../../selectstaff/select-staff.service'
import {isNumber} from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: 'manageServers',
  templateUrl: './manage-servers.component.html',
  styleUrls: ['./manage-servers.component.css'],
  providers: [ToastsManager, ToastOptions]
})
export class ManageServersComponent {
  private trufluid;
  private manageserverdetails;
  private manageserversrangedetails;
  private restarauntid;
  public isShow: boolean = false;
  public isChecked: boolean = false;
  public result = [];
  private currentRowInfo;
  private arr = [];
  private globalCount = 0;
  private listOfRanges = [];
  private savedList: any = [];
  private flag;
  private message;
  private newuserId;
  private errorcode: any;
  private statusmessage: any;
  public modalRef: BsModalRef;
  public style = [];
  public restID = localStorage.getItem('restaurantid');

  constructor(private router: Router, private _managerservice: ManageServersService, private _loginservice: LoginService, private modalService: BsModalService, private _toastr: ToastsManager, vRef: ViewContainerRef, private selectstaff: StaffService,) {
    this._toastr.setRootViewContainerRef(vRef);
    this.restarauntid = _loginservice.getRestaurantId();
    this.getmanagerServer(this.restarauntid);
  }

  ngOnInit() {
    this.dummy();
  }

  public openModal(template) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
    });
  }

//subscribing mangeservers details here
  getmanagerServer(restarauntid) {
    var that = this;
    this._managerservice.getManageServersDetails(restarauntid).subscribe((res: any) => {
      this.manageserverdetails = res._Data.ManageServer;
      this.manageserversrangedetails = res._Data.TableRange;
      this.result = [];
      this.savedList = [];
      if (this.manageserverdetails) {
        //adding seatnumbers functionality
        this.manageserverdetails.map(function (obj) {
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
      this.result.map(function (obj) {
        obj.sectionsCount = obj.seatNumbers.length;
        obj.seatNumbers.map(function (seatObj) {
          that.globalCount++;
          seatObj['range_' + that.globalCount] = seatObj.StartTableNumber + '-' + seatObj.EndTableNumber;
          seatObj.HostessID = obj.TruflUserID;
          seatObj.RestaurantID = obj.RestaurantID;
          that.listOfRanges.push({
            ['range_' + that.globalCount]: seatObj['range_' + that.globalCount]
          });
          if (seatObj.StartTableNumber !== '' && seatObj.EndTableNumber !== '') {
            that.savedList.push(seatObj)
          }
        });
      });
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
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

//sidenav info from here
  showProfile(profile, seatArr, index) {
    var _that = this;
    this.currentRowInfo = profile;
    this.trufluid = this.currentRowInfo.TruflUserID;
    this.currentRowInfo.checked = false;

    if (this.currentRowInfo.ActiveInd == 1) {
      this.currentRowInfo.checked = true;
    }
    this.arr = seatArr;
    this.currentRowInfo.arr = this.arr;
    this.isShow = true;
    this.isChecked = false;
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

  toNumber() {
    this.trufluid = +this.trufluid;
    this.newuserId = this.trufluid;
  }

  updateStartEndLogic(values, index, isStartOrEnd) {
    let arrayrange;
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
        else if ((+(obj.StartTableNumber) < +(that.manageserversrangedetails[0].FirstTableNumber) && (obj.StartTableNumber != '')) || (+(obj.EndTableNumber) > +(that.manageserversrangedetails[0].LastTableNumber))) {
          that.flag = true;
          that.message = "Exceeded TableRange";
        }
      }
    });
  }

//clock in clock off
  updateServerStatus(value, index) {
    if (value == false) {
      this.manageserverdetails.ActiveInd = 0;

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

  cancel() {
    this.router.navigateByUrl('/defaultSettings');
  }

//saving updated data
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

    this._managerservice.postManageserverDetails(this.savedList).subscribe((res: any) => {
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

//modal popup post
  modalSubmit(value) {
    var that = this;
    this.currentRowInfo.checked = true;
    this._managerservice.postManageserverModalDetails(this.restarauntid, this.currentRowInfo.TruflUserID, this.newuserId).subscribe((res: any) => {
      this.currentRowInfo.checked = true;
      this.isShow = false;
      this.getmanagerServer(this.restarauntid);
    }, (err) => {
      if (err === 0) {
        this._toastr.error('network error')
      }
    })
    this.modalRef.hide();
  }

  test(num) {
    return !isNaN(num)
  }

  modalClose() {
    this.trufluid = this.currentRowInfo.TruflUserID;
    this.currentRowInfo.checked = true;
    this.modalRef.hide();
  }

  dismiss() {
    this.trufluid = this.currentRowInfo.TruflUserID;
    this.currentRowInfo.checked = true;
  }

  selectserver(value, index) {
    this.newuserId = value;
  }

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
