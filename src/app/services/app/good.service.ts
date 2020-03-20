import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoodParam, ProductModel } from '@model/index';

import { AppService } from '../core/app.service';

@Injectable()
export class GoodService {
  constructor( 
    protected appService: AppService
  ) { }

  queryGoods(param?: GoodParam) {
    if (param) {
      let httpParams = new HttpParams();
      Object.keys(param).forEach(function (key: any) {
        if (param[key]) {
          if (key === 'page') {
            httpParams = httpParams.append(
              key,
              JSON.stringify(parseInt(param[key], 0) - 1)
            );

          } else {
            httpParams = httpParams.append(key, param[key]);
          }
        }
      });
      return this.appService.get(
        '/goods/', 
        httpParams
        );
    }
    return this.appService.get(
      `/goods?page=0&size=10000`
      );
  }
  
  create(product: ProductModel) {
    return this.appService.post(
      '/goods/', 
      product
      );
  }

  retrieveById(goodId: number) {
    return this.appService.get(
      `/goods/${goodId}`
      );
  }

  update(product: ProductModel) {
    return this.appService.put(
      '/goods/', 
      product
      );
  }

  uploadFile(formData: FormData) {
    return this.appService.postFormData(
      '/goods/upload/', 
      formData
      );
  }

  downloadFile() {
    return this.appService.getByResponseArrayBuffer(
      '/goods/download'
      );
  }
}
