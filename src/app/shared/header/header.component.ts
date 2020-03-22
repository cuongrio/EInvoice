import { COOKIE_KEY } from 'app/constant';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/index';
import { UserModel } from '@model/index';
import { AppService, CookieService, UtilsService } from '@service/index';

import { DEFAULT_ROUTER } from '../../constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menuItems = DEFAULT_ROUTER;
  userLogged: UserModel;
  name: String;
  activeClass: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private cookieService: CookieService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.userLogged =
      this.authService.credentials;

    if (!this.userLogged) {
      this.router.navigate(['/dang-nhap']);
    }

    this.appService.getTenantInfo()
      .subscribe((data: any) => {
        if (data) {
          if (data.company_name) {
            this.name = data.company_name
          }
          if (data.tax_code) {
            this.name += " - " + data.tax_code;
          }
          this.name += " - " + this.userLogged.name
          if (data.signature_type) {
            this.cookieService.set(COOKIE_KEY.signatureType, data.signature_type);
          }
        } else {
          this.name = this.userLogged.name;
        }
      }, () => {
        this.name = this.userLogged.name;
      });
  }


  logoutClicked() {
    this.authService.logout();
    this.utilsService.clear();
    this.cookieService.clear();
    this.cookieService.delete(COOKIE_KEY.tenant);
    this.cookieService.delete(COOKIE_KEY.token);
    this.router.navigate(['/dang-nhap']);
  }

  isActiveNav(route: any): boolean {
    if (route.sub
      || !route.navigate) {
      return false;
    }

    if (this.router.url.includes(route.navigate)) {
      return true;
    }
    return false;
  }
}
