import { Injectable } from '@angular/core';
import { SelectData } from '@app/_models';

@Injectable()
export class UtilsService {
  getStatusName(code: string, arr: Array<SelectData>): string {
    if(!code){
      return code;
    }
    if (arr.length == 0) {
      const statusJson = sessionStorage.getItem('comboStatus');
      arr = JSON.parse(statusJson) as SelectData[];
    }
    const status = arr.find(i => (i.code === code));
    return status ? status.value : code;
  }
  getPaymentTypeName(code: string, arr: Array<SelectData>): string {
    if(!code){
      return code;
    }
    if (arr.length == 0) {
      const statusJson = sessionStorage.getItem('comboHTTT');
      arr = JSON.parse(statusJson) as SelectData[];
    }
    const status = arr.find(i => (i.code === code));
    return status ? status.value : code;
  }
}
