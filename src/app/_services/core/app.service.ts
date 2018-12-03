import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@app/core';
import { UserModel } from '@app/_models';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../core/authentication/authentication.service';
import { environment } from './../../../environments/environment';
import { HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AppService {
  constructor(
    private router: Router,
    private httpService: HttpService,
    private authenticationService: AuthenticationService
  ) {}

  public get(url: string, httpParams?: HttpParams): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }

    return this.httpService.request('GET', tenantUrl, {
      //headers: this.appendHeader,
      params: httpParams,
      responseType: 'json',
      withCredentials: true
    });
  }

  public post(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeader,
      body: JSON.stringify(body),
      responseType: 'json',
      withCredentials: true
    });
  }

  public put(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }
    return this.httpService.request('PUT', url, {
      headers: this.appendHeader,
      body: JSON.stringify(body),
      responseType: 'json',
      withCredentials: true
    });
  }

  public delete(url: string): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/login']);
    }

    return this.httpService.request('DELETE', tenantUrl, {
      headers: this.appendHeader,
      responseType: 'json',
      withCredentials: true
    });
  }

  private appendHeader(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('content-type', 'application/json');

    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials) {
      const token = credentials.token;
      if (token !== null) {
        headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return headers;
  }

  private getTenantUrl(url: string) {
    if (!url.startsWith('http')) {
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
