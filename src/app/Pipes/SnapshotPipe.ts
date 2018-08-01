import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'splitString'
})
export class SPlitStringPipe implements PipeTransform {
  transform(value: any) {
    let array: any;
    array = value.split(' ');
    return array[0];
  }
}
