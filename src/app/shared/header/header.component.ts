import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Trang chủ', icon: 'link-icon icon-screen-desktop' },
  { path: '/products', title: 'Hàng hóa', icon: 'link-icon icon-disc' },
  { path: '/customers', title: 'Tệp khách hàng', icon: 'link-icon icon-pie-chart' },
  { path: '/invoices', title: 'Dải hóa đơn', icon: 'link-icon icon-docs' },
  { path: '/report', title: 'Báo cáo', icon: 'link-icon icon-calculator' },
  { path: '/info', title: 'Thông tin Công ty', icon: 'link-icon icon-book-open' }
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
