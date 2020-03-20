import { Injectable } from '@angular/core';
import { SelectData } from '@model/index';
import { STORE_KEY } from 'app/constant';

@Injectable()
export class UtilsService {
  getStatusName(
    code: string,
    arr: Array<SelectData>
  ): string {
    if (!code) {
      return code;
    }
    if (!arr) {
      const data = this.getKey(STORE_KEY.statusCb);
      if (data) {
        arr = JSON.parse(data) as SelectData[]; 
      }
    }
    if(!arr){
      return code;
    }
    const status = arr.find(i => (i.code === code));
    return status ? status.value : code;
  }

  getPaymentMethodName(
    code: string,
    arr: Array<SelectData>
  ): string {
    if (!code) {
      return code;
    }
    if (!arr) {
      const data = this.getKey(STORE_KEY.htttCb)
      if (data) {
        arr = JSON.parse(data) as SelectData[];
      }
    }
    if(!arr){
      return code;
    }
    const status = arr.find(i => (i.code === code));
    return status ? status.value : code;
  }

  cleanCb(
    items: Array<SelectData>
  ): Array<SelectData> {
    return items.filter((item, index) => {
      return index === items.findIndex(obj => {
        return obj.code === item.code;
      });
    });
  }

  putKey(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getKey(key: string): any {
    return this.storage.getItem(key);
  }
  
  clear(){
    this.storage.clear();
  }

  get nativeWindow(): Window {
    return typeof window !== 'undefined' ? window : undefined;
  }

  get storage(): Storage {
    let retStorage: Storage;
    try {
      retStorage = this.nativeWindow
        ? this.nativeWindow.sessionStorage
        : undefined;
    } catch{ }
    return retStorage;
  }
}
