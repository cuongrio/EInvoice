import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@app/_models';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

declare var $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Trang chủ', icon: 'link-icon icon-screen-desktop' },
  { path: '/products', title: 'Hàng hóa', icon: 'link-icon icon-disc' },
  { path: '/customers', title: 'Tệp khách hàng', icon: 'link-icon icon-pie-chart' },
  { path: '/invoices', title: 'Danh sách hóa đơn', icon: 'link-icon icon-docs' },
  { path: '/report', title: 'Báo cáo', icon: 'link-icon icon-calculator' },
  { path: '/info', title: 'Thông tin Công ty', icon: 'link-icon icon-book-open' }
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  menuItems: any[];
  userLogged: UserModel;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    // this.userLogged = this.authenticationService.credentials;
    this.userLogged = {name: 'cuongrio'}
  }

  ngAfterViewInit() {
    $(window).scroll(function() {
      if (window.matchMedia('(min-width: 992px)').matches) {
        const header = '.navbar.horizontal-layout';
        if ($(window).scrollTop() >= 70) {
          $(header).addClass('fixed-on-scroll');
        } else {
          $(header).removeClass('fixed-on-scroll');
        }
      }
    });
  }

  logoutClicked() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
