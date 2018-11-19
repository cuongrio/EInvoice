import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InvoiceParams } from './../app.interface';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    API_URL = 'http://178.128.123.223:8080';

    constructor(private httpClient: HttpClient) { }

    getInvoices(queryObj?: InvoiceParams): Observable<any> {
        if (queryObj) {
            const params = new HttpParams();
            if (queryObj.sort) { params.set('sort', queryObj.sort); }
            if (queryObj.sortBy) { params.set('sortBy', queryObj.sortBy); }
            if (queryObj.size) { params.set('size', queryObj.size); }
            if (queryObj.page) { params.set('page', queryObj.page); }
            if (queryObj.fromDate) { params.set('fromDate', queryObj.fromDate); }
            if (queryObj.toDate) { params.set('toDate', queryObj.toDate); }
            if (queryObj.invoiceNo) { params.set('invoiceNo', queryObj.invoiceNo); }
            if (queryObj.form) { params.set('form', queryObj.form); }
            if (queryObj.serial) { params.set('serial', queryObj.serial); }
            if (queryObj.orgTaxCode) { params.set('orgTaxCode', queryObj.orgTaxCode); }
            return this.httpClient.get(`${this.API_URL}/1/invoices`, { params: params });
        }
        return this.httpClient.get(`${this.API_URL}/1/invoices`);
    }

    // createContact(contact) {
    //     return this.httpClient.post(`${this.API_URL}/contacts/`, contact);
    // }
    // updateContact(contact) {
    //     return this.httpClient.put(`${this.API_URL}/contacts/`, contact);
    // }
    // deleteContact(contact) {
    //     return this.httpClient.delete(`${this.API_URL}/contacts/${contact.pk}`);
    // }
    // getLeads() {
    //     return this.httpClient.get(`${this.API_URL}/leads`);
    // }
    // getOpportunities() {
    //     return this.httpClient.get(`${this.API_URL}/opportunities`);
    // }
}
