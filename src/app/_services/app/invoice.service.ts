import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { InvoiceModel } from '@app/_models';
import { InvoiceParam } from './../../_models/param/invoice.param';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    constructor(private httpClient: HttpClient) { }

    /** PDF */
    preview(invoiceModel: InvoiceModel) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/preview`, invoiceModel);
    }

    print(invoiceId: number) {
        return this.httpClient.get(`${environment.serverUrl}/invoices/${invoiceId}/print`);
    }

    download(invoiceId: number) {
        return this.httpClient.get(`${environment.serverUrl}/invoices/${invoiceId}/download`);
    }

    transform(invoiceId: number) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/${invoiceId}/transform`, {});
    }

    /** INVOICE */
    createInvoice(invoiceModel: InvoiceModel) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/`, invoiceModel);
    }

    updateInvoice(invoiceModel: InvoiceModel) {
        return this.httpClient.put(`${environment.serverUrl}/invoices/`, invoiceModel);
    }

    approveInvoice(invoiceId: number) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/${invoiceId}/approve`, {});
    }

    ajustInvoice(invoiceId: number, invoiceModel: InvoiceModel) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/${invoiceId}/adjust`, invoiceModel);
    }

    retrieveInvoiceById(invoiceId: number) {
        return this.httpClient.get(`${environment.serverUrl}/invoices/${invoiceId}`);
    }

    disposeInvoice(invoiceId: number) {
        return this.httpClient.delete(`${environment.serverUrl}/invoices/${invoiceId}`);
    }

    disposeSignedInvoice(invoiceId: number) {
        return this.httpClient.delete(`${environment.serverUrl}/invoices/${invoiceId}/signed`);
    }

    queryInvoices(invoiceParam?: InvoiceParam) {
        if (invoiceParam) {
            let params = new HttpParams();

            if (invoiceParam.sort) {
                params = params.append('sort', invoiceParam.sort);
            }
            if (invoiceParam.sortBy) {
                params = params.append('sortBy', invoiceParam.sortBy);
            }
            if (invoiceParam.size) {
                params = params.append('size', invoiceParam.size);
            }
            if (invoiceParam.page) {
                const currentPage = JSON.stringify(parseInt(invoiceParam.page, 0) - 1);
                params = params.append('page', currentPage);
            }
            if (invoiceParam.fromDate) {
                params = params.append('fromDate', invoiceParam.fromDate);
            }
            if (invoiceParam.toDate) {
                params = params.append('toDate', invoiceParam.toDate);
            }
            if (invoiceParam.invoiceNo) {
                params = params.append('invoiceNo', invoiceParam.invoiceNo);
            }
            if (invoiceParam.form) {
                params = params.append('form', invoiceParam.form);
            }
            if (invoiceParam.serial) {
                params = params.append('serial', invoiceParam.serial);
            }
            if (invoiceParam.orgTaxCode) {
                params = params.append('orgTaxCode', invoiceParam.orgTaxCode);
            }
            return this.httpClient.get(`${environment.serverUrl}/invoices`, { params: params });
        }
        return this.httpClient.get(`${environment.serverUrl}/invoices`);
    }

    /** END INVOICE */

    /*** SIGNED */
    listToken() {
        return this.httpClient.get(`${environment.pluginUrl}/token`);
    }

    sign(invoiceId: number) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/${invoiceId}/sign`, {});
    }

    signByToken(alias: string, pdfbase64: string, signatureImage: string, location: string, ahdsign: string) {
        let body = new HttpParams();
        body = body.set('alias', alias);
        body = body.set('pdf-base64', pdfbase64);
        body = body.set('signature-img', signatureImage);
        body = body.set('location', location);
        body = body.set('ahdsign', ahdsign);

        return this.httpClient.post(`${environment.pluginUrl}/token`, body);
    }

    signed(invoiceId: number, signEncode: string) {
        return this.httpClient.post(`${environment.serverUrl}/invoices/${invoiceId}/signed`, signEncode);
    }
}
