import { Observable } from 'rxjs';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, HttpService } from '@core/index';
import { environment } from '@env/environment';
import { UserModel } from '@model/index';

@Injectable()
export class AppService {
  constructor(
    private router: Router,
    private httpService: HttpService,
    private authenticationService: AuthenticationService
  ) { }

  getTenantUrl(url: string) {
    if (url.indexOf('ahoadonplugin') === -1) {
      const credentials: UserModel = this.authenticationService.credentials;
      if (credentials && credentials.tenant) {
        return `${environment.serverUrl}/api/${credentials.tenant}${url}`;
      } else {
        this.router.navigate(['/dang-nhap']);
      }
    }
    return url;
  }

  postForPreview(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeaderForJson(),
      body: JSON.stringify(body),
      responseType: 'text/html'
    });
  }


  postFormData(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeaderFormData(),
      body: body,
      responseType: 'arraybuffer'
    });
  }

  postForText(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeaderForText(),
      body: body
    });
  }

  get(url: string, httpParams?: HttpParams): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }

    return this.httpService.request('GET', tenantUrl, {
      headers: this.appendHeaderForJson(),
      params: httpParams ? httpParams : {}
    });
  }

  getByResponseArrayBuffer(
    url: string,
    httpParams?: HttpParams
  ): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }

    return this.httpService.request('GET', tenantUrl, {
      headers: this.appendHeaderForJson(),
      params: httpParams ? httpParams : {},
      responseType: 'arraybuffer'
    });
  }

  getTenantInfo(): Observable<any> {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials && credentials.tenant) {
      return this.httpService.request(
        'GET',
        `${environment.serverUrl}/api/${credentials.tenant}`,
        {
          headers: this.appendHeaderForJson()
        });
    } else {
      this.router.navigate(['/dang-nhap']);
    }
  }

  updateTenantInfo(body: Object): Observable<any> {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials && credentials.tenant) {
      const tenantUrl = `${environment.serverUrl}/${credentials.tenant}`;
      return this.httpService.request('PUT', tenantUrl, {
        headers: this.appendHeaderForJson(),
        body: body
      });
    } else {
      this.router.navigate(['/dang-nhap']);
    }
  }

  post(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }
    return this.httpService.request('POST', tenantUrl, {
      headers: this.appendHeaderForJson(),
      body: body
    });
  }

  put(url: string, body: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }
    return this.httpService.request('PUT', tenantUrl, {
      headers: this.appendHeaderForJson(),
      body: body
    });
  }

  delete(url: string, body?: Object): Observable<any> {
    // check url
    const tenantUrl = this.getTenantUrl(url);
    if (tenantUrl === '') {
      this.router.navigate(['/dang-nhap']);
    }

    return this.httpService.request('DELETE', tenantUrl, {
      headers: this.appendHeaderForJson(),
      body: body
    });
  }

  private appendHeaderForJson(): HttpHeaders {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials) {
      const token = credentials.token;
      if (token !== null) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        });
        return headers;
      }
    } else {
      this.router.navigate(['/dang-nhap']);
    }
  }

  private appendHeaderFormData(): HttpHeaders {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials) {
      const token = credentials.token;
      if (token !== null) {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token
        });
        return headers;
      }
    } else {
      this.router.navigate(['/dang-nhap']);
    }
  }


  private appendHeaderForText(): HttpHeaders {
    const credentials: UserModel = this.authenticationService.credentials;
    if (credentials) {
      const token = credentials.token;
      if (token !== null) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/octet-stream',
          Authorization: 'Bearer ' + token
        });
        return headers;
      }
    } else {
      this.router.navigate(['/dang-nhap']);
    }
  }
}
