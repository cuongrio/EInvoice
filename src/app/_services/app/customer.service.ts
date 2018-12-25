import { Injectable } from '@angular/core';
import { CustomerModel } from './../../_models/customer.model';
import { AppService } from '@app/_services/core/app.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private appService: AppService) { }

  // CUSTOMERS
  getList() {
    return this.appService.get(`/customers`);
  }

  retrieveById(customerId: number) {
  }

  delete(customerId: number) {
  }

  create(customer: CustomerModel) {
    return this.appService.post(`/customers/`, customer);
  }

  update(customer: CustomerModel) {
    return this.appService.put(`/customers/`, customer);
  }
}
