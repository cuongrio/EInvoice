import { Injectable } from '@angular/core';
import { CustomerModel } from './../../_models/customer.model';
import { AppService } from '@app/_services/core/app.service';
import { CustomerParam } from './../../_models/param/customer.param';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private appConstant: AppConstant, private appService: AppService) { }

  // CUSTOMERS
  queryCustomers(param?: CustomerParam) {
    // mock
    // return of(this.appConstant.customerList);

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
      return this.appService.get(`/customers`, httpParams);
    }
    return this.appService.get(`/customers?page=0&size=10000`);
  }

  create(customer: CustomerModel) {
    return this.appService.post(`/customers/`, customer);
  }

  update(customer: CustomerModel) {
    return this.appService.put(`/customers/`, customer);
  }
}
