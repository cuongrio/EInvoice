import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { InvoiceModel } from '@app/_models';
import { InvoiceParam } from './../../_models/param/invoice.param';
import { AppService } from '../core/app.service';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpService } from '@app/core/http/http.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(
    private appConstant: AppConstant,
    private httpService: HttpService,
    private appService: AppService) { }

  /** PDF */
  preview(invoiceModel: InvoiceModel) {
    return this.appService.postForPreview(`/invoices/preview`, invoiceModel);
  }

  print(invoiceId: number) {
    return this.appService.postForPreview(`/invoices/${invoiceId}/print`, {});
  }

  download(invoiceId: number) {
    return this.appService.get(`/invoices/${invoiceId}/download`);
  }

  printTransform(invoiceId: number) {
    return this.appService.postForPreview(`/invoices/${invoiceId}/transform`, {});
  }

  /** INVOICE */
  createInvoice(invoiceModel: InvoiceModel) {
    return this.appService.post(`/invoices/`, invoiceModel);
  }

  updateInvoice(invoiceModel: InvoiceModel) {
    return this.appService.put(`/invoices/`, invoiceModel);
  }

  approveInvoice(invoiceId: number) {
    return this.appService.post(`/invoices/${invoiceId}/approve`, {});
  }

  ajustInvoice(invoiceId: number, invoiceModel: InvoiceModel) {
    return this.appService.post(`/invoices/${invoiceId}/adjust`, invoiceModel);
  }

  replaceInvoice(invoiceId: number, invoiceModel: InvoiceModel) {
    return this.appService.post(`/invoices/${invoiceId}/replace`, invoiceModel);
  }


  retrieveInvoiceById(invoiceId: number) {
    return this.appService.get(`/invoices/${invoiceId}`);
  }

  disposeInvoice(invoiceId: number) {
    return this.appService.delete(`/invoices/${invoiceId}`);
  }

  disposeSignedInvoice(invoiceId: number) {
    return this.appService.delete(`/invoices/${invoiceId}/signed`);
  }

  queryInvoices(invoiceParam?: InvoiceParam) {
    return of(this.appConstant.invoiceList);
    // if (invoiceParam) {
    //   let httpParams = new HttpParams();
    //   Object.keys(invoiceParam).forEach(function (key: any) {
    //     if (invoiceParam[key]) {
    //       if (key === 'page') {
    //         httpParams = httpParams.append(key, JSON.stringify(parseInt(invoiceParam[key], 0) - 1));
    //       } else {
    //         httpParams = httpParams.append(key, invoiceParam[key]);
    //       }
    //     }
    //   });
    //   return this.appService.get(`/invoices`, httpParams);
    // }
    // return this.appService.get(`/invoices?page=0&size=20`);
  }

  /** END INVOICE */

  /*** SIGNED */
  listToken() {
     return of(this.appConstant.listToken);
    // return this.appService.get(`${environment.pluginUrl}/token?fill=all`);
  }

  sign(invoiceId: number) {
    return this.appService.post(`/invoices/${invoiceId}/sign`, {});
  }

  signByToken(alias: string, pdfbase64: string, signatureImage: string, location: string, ahdsign: string) {
    const body = new URLSearchParams();
    body.set('alias', alias);
    body.set('ahdsign', ahdsign);
    body.set('pdf-base64', pdfbase64);
    body.set('signature-img', signatureImage);
    body.set('location', location);

    const options = {
      responseType: 'text' as 'json',
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpService
      .post(`${environment.pluginUrl}/token`, body.toString(), options);
  }

  signed(invoiceId: number, signEncode: any) {
    return this.appService.postForText(`/invoices/${invoiceId}/signed`, signEncode);
  }
}
