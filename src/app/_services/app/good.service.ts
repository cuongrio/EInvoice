import { Injectable } from '@angular/core';
import { ProductModel } from '@app/_models';
import { of } from 'rxjs';
import { AppService } from '@app/_services/core/app.service';

@Injectable({
  providedIn: 'root'
})
export class GoodService {
  constructor(private appService: AppService) { }

  /**** LIST *** */
  getList() {
   return this.appService.get(`/goods`);
   // return of(this.appConstant.goodList);
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
