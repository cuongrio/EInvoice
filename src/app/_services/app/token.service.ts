import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';
import { environment } from '@env/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(
    private appConstant: AppConstant,
    private appService: AppService,
    private httpClient: HttpClient) { }

  listToken() {
    // return this.appService.getWithNoToken(`${environment.pluginUrl}/token?fill=all`);
    // return of(this.appConstant.listToken);
    // const settings = {
    //   'async': true,
    //   'crossDomain': true,
    //   'url': 'https://ahoadonplugin.com:15668/token?fill=all',
    //   'method': 'GET'
    // };

    // $.ajax(settings).done(function (response: any) {
    //   console.log(response);
    // });
    return this.httpClient.get(`${environment.pluginUrl}/token?fill=all`);
  }
}
