import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/home', title: 'Trang chủ', icon: 'fa-home' },
  { path: '/goods', title: 'Hàng hóa', icon: 'fa-tshirt' },
  { path: '/customers', title: 'Khách hàng', icon: 'fa-user-tie' },
  { path: '/invoices', title: 'Dải hóa đơn', icon: 'fa-file' },
  { path: '/about', title: 'Thông tin Công ty', icon: 'fa-info-circle' }
];

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
