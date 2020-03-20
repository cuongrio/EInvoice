import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerModel, CustomerParam } from '@model/index';

import { AppService } from '../core/app.service';

@Injectable()
export class CustomerService {
  constructor(
    private appService: AppService
  ) { }

  queryCustomers(param?: CustomerParam) {
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
      return this.appService.get(`/customers`, httpParams);
    }
    return this.appService.get(`/customers?page=0&size=10000`);
  }

  create(customer: CustomerModel) {
    return this.appService.post(
      '/customers/',
      customer
    );
  }

  update(customer: CustomerModel) {
    return this.appService.put(
      '/customers/',
      customer
    );
  }

  uploadFile(formData: FormData) {
    return this.appService.postFormData(
      '/customers/upload/',
      formData
    );
  }

  downloadFile() {
    return this.appService.getByResponseArrayBuffer(
      '/customers/download'
    );
  }
}
