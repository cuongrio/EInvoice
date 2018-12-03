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
  constructor(private appConstant: AppConstant, private appService: AppService) {}

  /**** LIST *** */
  getList() {
    // return this.appService.get(`${environment.serverUrl}/goods`);
    return of(this.appConstant.goodList);
  }

  create(product: ProductModel) {
    return this.appService.post(`${environment.serverUrl}/goods/`, product);
  }

  update(product: ProductModel) {
    return this.appService.put(`${environment.serverUrl}/goods/`, product);
  }

  uploadFile() {}

  downloadFile() {
    return this.appService.get(`${environment.serverUrl}/goods/download`);
  }
}
