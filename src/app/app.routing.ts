import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import page
import { PageLayoutComponent } from './pages/page-layout.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { Page404Component } from './page404/page404.component';
import { RegisterComponent } from './register/register.component';
import { Exception500Component } from './exception/exception-500.component';

import { AuthGuard } from './_guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'customers',
        loadChildren: './pages/customers/customers.module#CustomersModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: './pages/products/products.module#ProductsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'invoices',
        loadChildren: './pages/invoices/invoices.module#InvoicesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'info',
        loadChildren: './pages/info/info.module#InfoModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'report',
        loadChildren: './pages/report/report.module#ReportModule',
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Thông tin đăng nhập' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Đăng xuất' }
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: { title: 'Thông tin đăng ký' }
  // },
  {
    path: '404',
    component: Page404Component,
    data: { title: 'Trang không tồn tại' }
  },
  {
    path: '500',
    component: Exception500Component,
    data: { title: 'Đã xảy ra lỗi' }
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
