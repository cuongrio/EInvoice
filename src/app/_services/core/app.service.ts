import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@app/core';
import { UserModel } from '@app/_models';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../core/authentication/authentication.service';
import { environment } from './../../../environments/environment';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class AppService {
  constructor(
    private router: Router,
    private httpService: HttpService,
    private authenticationService: AuthenticationService
  ) { }

  public postForPreview(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeader(),
      body: JSON.stringify(body),
      responseType: 'arraybuffer'
    });
  }

  public getWithNoToken(url: string): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }

    return this.httpService.request('GET', tenantUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }),
    });
  }


  public get(url: string, httpParams?: HttpParams): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }

    return this.httpService.request('GET', tenantUrl, {
      headers: this.appendHeader(),
      params: httpParams ? httpParams : {}
    });
  }

  public post(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeader(),
      body: JSON.stringify(body)
    });
  }

  public put(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }
    return this.httpService.request('PUT', url, {
      headers: this.appendHeader(),
      body: JSON.stringify(body)
    });
  }

  public delete(url: string): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }

    return this.httpService.request('DELETE', tenantUrl, {
      headers: this.appendHeader()
    });
  }

  private appendHeader(): HttpHeaders {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials) {
      const token = credentials.token;
      if (token !== null) {
        console.log('token: ' + token);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
        return headers;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getTenantUrl(url: string) {
    if (url.indexOf('ahoadonplugin') === -1) {
      const credentials: UserModel = this.authenticationService.credentials;
      if (credentials) {
        return `${environment.serverUrl}/${credentials.tenant}${url}`;
      } else {
        return '';
      }
    }
    return url;
  }
}
