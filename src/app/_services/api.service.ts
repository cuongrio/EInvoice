import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InvoiceParams, Good, Customer, InvoiceItem } from './../_models';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  API_URL = 'http://178.128.123.223:8080';
  PLUGIN_URL = 'https://ahoadonplugin.com:15668';

  constructor(private httpClient: HttpClient) { }

  /** LOGIN */
  login(username: string, password: string) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/preview`, {
      username: username,
      password: password
    });
  }

  /** PDF */
  preview(invoiceItem: InvoiceItem) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/preview`, invoiceItem);
  }

  print(invoiceId: number) {
    return this.httpClient.get(`${this.API_URL}/1/invoices/${invoiceId}/print`);
  }

  download(invoiceId: number) {
    return this.httpClient.get(`${this.API_URL}/1/invoices/${invoiceId}/download`);
  }

  transform(invoiceId: number) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/${invoiceId}/transform`, {});
  }

  /** INVOICE */
  createInvoice(invoiceItem: InvoiceItem) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/`, invoiceItem);
  }

  updateInvoice(invoiceItem: InvoiceItem) {
    return this.httpClient.put(`${this.API_URL}/1/invoices/`, invoiceItem);
  }

  approveInvoice(invoiceId: number) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/${invoiceId}/approve`, {});
  }

  ajustInvoice(invoiceId: number, invoiceItem: InvoiceItem) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/${invoiceId}/adjust`, invoiceItem);
  }

  retrieveInvoiceById(invoiceId: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/1/invoices/${invoiceId}`);
  }

  disposeInvoice(invoiceId: number) {
    return this.httpClient.delete(`${this.API_URL}/1/invoices/${invoiceId}`);
  }

  disposeSignedInvoice(invoiceId: number) {
    return this.httpClient.delete(`${this.API_URL}/1/invoices/${invoiceId}/signed`);
  }

  queryInvoices(invoiceParams?: InvoiceParams): Observable<any> {
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

  /** END INVOICE */

  /*** SIGNED */
  listToken() {
    return this.httpClient.get(`${this.PLUGIN_URL}/token`);
  }

  sign(invoiceId: number) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/${invoiceId}/sign`, {});
  }

  signByToken(alias: string, pdfbase64: string, signatureImage: string, location: string, ahdsign: string) {
    let body = new HttpParams();
    body = body.set('alias', alias);
    body = body.set('pdf-base64', pdfbase64);
    body = body.set('signature-img', signatureImage);
    body = body.set('location', location);
    body = body.set('ahdsign', ahdsign);

    return this.httpClient.post(`${this.PLUGIN_URL}/token`, body);
  }

  signed(invoiceId: number, signEncode: string) {
    return this.httpClient.post(`${this.API_URL}/1/invoices/${invoiceId}/signed`, signEncode);
  }

  /*** #END SIGNED */

  /**** LIST *** */
  getGoods(): Observable<any> {
    // const goods = new Array<Good>();
    // for (let i = 0; i <= 100; i++) {
    //   const good: Good = {
    //     goods_id: '00' + i,
    //     tenant_id: '00' + i,
    //     goods_code: 'GOOD_CODE' + i,
    //     goods_name: 'GOOD_NAME' + i,
    //     unit: 'CAI',
    //     price: '12344',
    //     tax_rate_code: '10',
    //     tax_rate: '10',
    //     goods_group: 'GOOD_GROUP' + i,
    //     insert_date: '2018-08-08'
    //   };
    //   goods.push(good);
    // }

    // return of(goods);
    return this.httpClient.get(`${this.API_URL}/1/goods`);
  }

  getCustomers(): Observable<any> {
    // const customers = new Array<Customer>();
    // for (let i = 0; i <= 100; i++) {
    //   const customer: Customer = {
    //     customer_id: '00' + i,
    //     tenant_id: '000',
    //     customer_code: 'C_CODE_' + i,
    //     customer_name: 'C_NAME_' + i,
    //     org: 'C_ORG_' + i,
    //     tax_code: '10',
    //     email: 'C_EMAIL_@gmail.com',
    //     address: 'C_ADDRESS_' + i,
    //     bank_account: '000000',
    //     bank: 'NHCT VIET NAM',
    //     phone: '000000'
    //   };
    //   customers.push(customer);
    // }

    // return of(customers);

    return this.httpClient.get(`${this.API_URL}/1/customers`);
  }

  getReferences(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/1/references`);
  }

  /**** END LIST */
}
