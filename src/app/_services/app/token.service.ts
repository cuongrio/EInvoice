import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { environment } from '@env/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private appConstant: AppConstant, private appService: AppService, private httpClient: HttpClient) { }

  listToken() {
    return this.httpClient.get(`${environment.pluginUrl}/token?fill=all`);
  }
}
