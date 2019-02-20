import { Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(
    private appConstant: AppConstant, private httpClient: HttpClient) { }

  listToken() {
    return of(this.appConstant.listToken);
    // return this.httpClient.get(`${environment.pluginUrl}/token?fill=all`);
  }
}
