import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { CustomerModel } from './../../_models/customer.model';
import { AppService } from '@app/_services/core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(
        private appConstant: AppConstant,
        private appService: AppService) { }

    // CUSTOMERS
    getList() {
        // return this.appService.get(`${environment.serverUrl}/customers`);
        return of(this.appConstant.customerList);
    }

    create(customer: CustomerModel) {
        return this.appService.post(`${environment.serverUrl}/customers/`, customer);
    }

    update(customer: CustomerModel) {
        return this.appService.put(`${environment.serverUrl}/customers/`, customer);
    }
}
