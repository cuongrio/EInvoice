import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { CustomerModel } from './../../_models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private httpClient: HttpClient) { }

    // CUSTOMERS
    getList() {
        const customers = new Array<CustomerModel>();
        for (let i = 0; i <= 100; i++) {
          const customer: CustomerModel = {
            customer_id: '00' + i,
            tenant_id: '000',
            customer_code: 'C_CODE_' + i,
            customer_name: 'C_NAME_' + i,
            org: 'C_ORG_' + i,
            tax_code: '10',
            email: 'C_EMAIL_@gmail.com',
            address: 'C_ADDRESS_' + i,
            bank_account: '000000',
            bank: 'NHCT VIET NAM',
            phone: '000000'
          };
          customers.push(customer);
        }

        return of(customers);

        // return this.httpClient.get(`${environment.serverUrl}/customers`);
    }

    create(customer: CustomerModel) {
        return this.httpClient.post(`${environment.serverUrl}/customers/`, customer);
    }

    update(customer: CustomerModel) {
        return this.httpClient.put(`${environment.serverUrl}/customers/`, customer);
    }
}
