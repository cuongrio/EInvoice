import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InvoiceParams } from './../_models';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  API_URL = 'http://178.128.123.223:8080';

  constructor(private httpClient: HttpClient) {}

  getGoods() {
    return this.httpClient.get(`${this.API_URL}/1/goods`);
  }

  getCustomers() {
    return this.httpClient.get(`${this.API_URL}/1/customers`);
  }

  getReferences() {
    return this.httpClient.get(`${this.API_URL}/1/references`);
  }

  getInvoiceRetrieveById(invoiceId: number) {
    return this.httpClient.get(`${this.API_URL}/1/invoices/${invoiceId}`);
  }

  getInvoices(invoiceParams?: InvoiceParams): Observable<any> {
    if (invoiceParams) {
      let params = new HttpParams();

      if (invoiceParams.sort) {
        params = params.append('sort', invoiceParams.sort);
      }
      if (invoiceParams.sortBy) {
        params = params.append('sortBy', invoiceParams.sortBy);
      }
      if (invoiceParams.size) {
        params = params.append('size', invoiceParams.size);
      }
      if (invoiceParams.page) {
        const currentPage = JSON.stringify(parseInt(invoiceParams.page, 0) - 1);
        params = params.append('page', currentPage);
      }
      if (invoiceParams.fromDate) {
        params = params.append('fromDate', invoiceParams.fromDate);
      }
      if (invoiceParams.toDate) {
        params = params.append('toDate', invoiceParams.toDate);
      }
      if (invoiceParams.invoiceNo) {
        params = params.append('invoiceNo', invoiceParams.invoiceNo);
      }
      if (invoiceParams.form) {
        params = params.append('form', invoiceParams.form);
      }
      if (invoiceParams.serial) {
        params = params.append('serial', invoiceParams.serial);
      }
      if (invoiceParams.orgTaxCode) {
        params = params.append('orgTaxCode', invoiceParams.orgTaxCode);
      }
      return this.httpClient.get(`${this.API_URL}/1/invoices`, { params: params });
    }
    return this.httpClient.get(`${this.API_URL}/1/invoices`);
  }
}
