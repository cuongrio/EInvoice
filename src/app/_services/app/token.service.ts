import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient) { }

  listToken() {
    return this.httpClient.get(`${environment.pluginUrl}/token`);
  }
}
