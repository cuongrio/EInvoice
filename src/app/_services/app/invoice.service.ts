import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { InvoiceModel } from '@app/_models';
import { InvoiceParam } from './../../_models/param/invoice.param';
import { AppService } from '../core/app.service';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { AppConstant } from '@app/_mock/mock.data';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private appConstant: AppConstant, private appService: AppService) { }

  /** PDF */
  preview(invoiceModel: InvoiceModel) {
    return this.appService.post(`/invoices/preview`, invoiceModel);
  }

  print(invoiceId: number) {
    return this.appService.get(`/invoices/${invoiceId}/print`);
  }

  download(invoiceId: number) {
    return this.appService.get(`/invoices/${invoiceId}/download`);
  }

  printTransform(invoiceId: number) {
    return this.appService.post(`/invoices/${invoiceId}/transform`, {});
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
    if (invoiceParam) {
      let httpParams = new HttpParams();
      Object.keys(invoiceParam).forEach(function (key: any) {
        console.log('key: ' + key + '||| ' + invoiceParam[key]);
        if (invoiceParam[key]) {
          if (key === 'page') {
            httpParams = httpParams.append(key, JSON.stringify(parseInt(invoiceParam[key], 0) - 1));
          } else {
            httpParams = httpParams.append(key, invoiceParam[key]);
          }
        }
      });
      console.log('httpParams: ' + httpParams);
      return this.appService.get(`/invoices`, httpParams);
    }
    return this.appService.get(`/invoices`);

    // return of(this.appConstant.invoiceList);
  }

  /** END INVOICE */

  /*** SIGNED */
  listToken() {
    return this.appService.get(`${environment.pluginUrl}/token?fill=all`);
  }

  sign(invoiceId: number) {
    return this.appService.post(`/invoices/${invoiceId}/sign`, {});
  }

  signByToken(alias: string, pdfbase64: string, signatureImage: string, location: string, ahdsign: string) {
    let body = new HttpParams();
    body = body.set('alias', alias);
    body = body.set('pdf-base64', pdfbase64);
    body = body.set('signature-img', signatureImage);
    body = body.set('location', location);
    body = body.set('ahdsign', ahdsign);

    return this.appService.post(`${environment.pluginUrl}/token`, body);
  }

  signed(invoiceId: number, signEncode: string) {
    return this.appService.post(`/invoices/${invoiceId}/signed`, signEncode);
  }
}