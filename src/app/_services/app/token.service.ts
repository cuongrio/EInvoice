import { Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private httpClient: HttpClient) { }

  listToken() {
    return this.httpClient.get(`${environment.pluginUrl}/token?fill=all`);
  }
}
