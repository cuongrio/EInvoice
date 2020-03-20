import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { InvoiceModel, InvoiceParam } from '@model/index';

import { AppService } from '../core/app.service';
import { PAGE } from 'app/constant';

@Injectable()
export class InvoiceService {
  constructor(
    protected httpService: HttpService,
    protected appService: AppService
  ) { }

  /** PDF */
  preview(invoice: InvoiceModel) {
    return this.appService.postForPreview(
      `/invoices/preview`,
      invoice
    );
  }

  print(id: number) {
    return this.appService.postForPreview(
      `/invoices/${id}/einv-preview`,
      {}
    );
  }

  download(id: number) {
    return this.appService.get(
      `/invoices/${id}/einv-download`
    );
  }

  printTransform(id: number) {
    return this.appService.postForPreview(
      `/invoices/${id}/einv-transform`,
      {}
    );
  }

  /** INVOICE */
  createInvoice(invoice: InvoiceModel) {
    return this.appService.post(
      '/invoices/',
      invoice
    );
  }

  updateInvoice(invoice: InvoiceModel) {
    return this.appService.put(
      '/invoices/',
      invoice
    );
  }

  approveInvoice(id: number) {
    return this.appService.post(
      `/invoices/${id}/approve`,
      {}
    );
  }

  ajustInvoice(
    id: number,
    invoice: InvoiceModel
  ) {
    return this.appService.post(
      `/invoices/${id}/adjust`,
      invoice
    );
  }

  replaceInvoice(
    id: number,
    invoice: InvoiceModel
  ) {
    return this.appService.post(
      `/invoices/${id}/replace`,
      invoice
    );
  }


  retrieveInvoiceById(id: number) {
    return this.appService.get(
      `/invoices/${id}`
    );
  }

  disposeInvoice(id: number) {
    return this.appService.delete(
      `/invoices/${id}`
    );
  }

  disposeSignedInvoice(
    id: number,
    body?: any
  ) {
    return this.appService.delete(
      `/invoices/${id}/signed`,
      body
    );
  }

  queryInvoices(param?: InvoiceParam) {
    if (param) {
      let httpParams = new HttpParams();
      Object.keys(param)
        .forEach(function (key: any) {

          if (param[key]) {
            if (key === 'page') {
              httpParams = httpParams.append(
                key,
                JSON.stringify(parseInt(param[key], 0) - 1)
              );
            } else {
              httpParams = httpParams.append(key, param[key]);
            }
          }
        });
      return this.appService.get(
        '/invoices/',
        httpParams
      );
    }
    return this.appService.get(
      `/invoices?page=${PAGE.firstPage}&size=${PAGE.size}`
    );
  }

  /** END INVOICE */

  /*** SIGNED */
  exportXmlDocument(id: number) {
    return this.appService.post(
      `/invoices/${id}/einv-xml`,
      {}
    );
  }

  saveXmlDocument(
    id: number,
    signedXml: any
  ) {
    return this.appService.postForText(
      `/invoices/${id}/einv-xml-save`,
      signedXml
    );
  }

  signSoft(id: number) {
    return this.appService.post(
      `/invoices/${id}/einv-sign`,
      {}
    );
  }
}
