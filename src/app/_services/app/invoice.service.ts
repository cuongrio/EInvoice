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
  constructor(private appConstant: AppConstant, private appService: AppService) {}

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

  transform(invoiceId: number) {
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
      const params = new HttpParams();

      if (invoiceParam.sort) {
        params.set('sort', invoiceParam.sort);
      }
      if (invoiceParam.sortBy) {
        params.set('sortBy', invoiceParam.sortBy);
      }
      if (invoiceParam.size) {
        params.set('size', invoiceParam.size);
      }
      if (invoiceParam.page) {
        const currentPage = JSON.stringify(parseInt(invoiceParam.page, 0) - 1);
        params.set('page', currentPage);
      }
      if (invoiceParam.fromDate) {
        params.set('fromDate', invoiceParam.fromDate);
      }
      if (invoiceParam.toDate) {
        params.set('toDate', invoiceParam.toDate);
      }
      if (invoiceParam.invoiceNo) {
        params.set('invoiceNo', invoiceParam.invoiceNo);
      }
      if (invoiceParam.form) {
        params.set('form', invoiceParam.form);
      }
      if (invoiceParam.serial) {
        params.set('serial', invoiceParam.serial);
      }
      if (invoiceParam.orgTaxCode) {
        params.set('orgTaxCode', invoiceParam.orgTaxCode);
      }
      console.log('params: ' + JSON.stringify(params));
      return this.appService.get(`/invoices`, params);
    }
    return this.appService.get(`/invoices`);

    // return of(this.appConstant.invoiceList);
  }

  /** END INVOICE */

  /*** SIGNED */
  listToken() {
    return this.appService.get(`${environment.pluginUrl}/token`);
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
