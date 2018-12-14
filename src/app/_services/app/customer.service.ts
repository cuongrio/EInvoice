import { Injectable } from '@angular/core';
import { CustomerModel } from './../../_models/customer.model';
import { AppService } from '@app/_services/core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private appConstant: AppConstant, private appService: AppService) { }

  // CUSTOMERS
  getList() {
    return this.appService.get(`/customers`);
  }

  retrieveById(customerId: number) {
    return of(this.appConstant.customerDetail);
  }

  delete(customerId: number) {
    return of(this.appConstant.customerDetail);
  }

  create(customer: CustomerModel) {
    return this.appService.post(`/customers/`, customer);
  }

  update(customer: CustomerModel) {
    return this.appService.put(`/customers/`, customer);
  }
}
