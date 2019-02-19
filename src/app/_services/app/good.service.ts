import { Injectable } from '@angular/core';
import { ProductModel } from '@app/_models';
import { of } from 'rxjs';
import { AppService } from '@app/_services/core/app.service';
import { GoodParam } from './../../_models/param/good.param';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '@app/_mock/mock.data';

@Injectable({
  providedIn: 'root'
})
export class GoodService {
  constructor(private appConstant: AppConstant, private appService: AppService) { }

  /**** LIST *** */
  queryGoods(param?: GoodParam) {
    // return of(this.appConstant.goodList);
    if (param) {
      let httpParams = new HttpParams();
      Object.keys(param).forEach(function (key: any) {
        if (param[key]) {
          if (key === 'page') {
            httpParams = httpParams.append(key, JSON.stringify(parseInt(param[key], 0) - 1));
          } else {
            httpParams = httpParams.append(key, param[key]);
          }
        }
      });
      return this.appService.get(`/goods`, httpParams);
    }
    return this.appService.get(`/goods?page=0&size=10000`);
  }
  create(product: ProductModel) {
    return this.appService.post(`/goods/`, product);
  }

  delete(goodId: number) {
  }

  retrieveById(goodId: number) {
    return this.appService.get(`/goods/${goodId}`);
    // return of(this.appConstant.goodDetail);
  }

  update(product: ProductModel) {
    return this.appService.put(`/goods/`, product);
  }

  uploadFile() { }

  downloadFile() {
    return this.appService.get(`/goods/download`);
  }
}
