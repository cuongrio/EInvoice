import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReferenceService {

    constructor(private httpClient: HttpClient) { }

    /***TENANT */
    tenanInfo() {
        return this.httpClient.get(`${environment.serverUrl}/1`);
    }

    referenceInfo() {
        return this.httpClient.get(`${environment.serverUrl}/references`);
    }
}
