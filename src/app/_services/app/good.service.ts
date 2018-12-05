import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ProductModel } from '@app/_models';
import { of } from 'rxjs';
import { AppService } from '@app/_services/core/app.service';
import { AppConstant } from '@app/_mock/mock.data';

@Injectable({
  providedIn: 'root'
})
export class GoodService {
  constructor(private appConstant: AppConstant, private appService: AppService) { }

  /**** LIST *** */
  getList() {
    // return this.appService.get(`/goods`);
    return of(this.appConstant.goodList);
  }

  create(product: ProductModel) {
    return this.appService.post(`/goods/`, product);
  }

  delete(goodId: number) {
    return of(this.appConstant.customerDetail);
  }

  retrieveById(goodId: number) {
    // return this.appService.get(`/invoices/${invoiceId}`);
    return of(this.appConstant.goodDetail);
  }

  update(product: ProductModel) {
    return this.appService.put(`/goods/`, product);
  }

  uploadFile() { }

  downloadFile() {
    return this.appService.get(`/goods/download`);
  }
}
