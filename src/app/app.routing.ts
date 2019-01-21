import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import page
import { PageLayoutComponent } from './pages/page-layout.component';
import { LoginComponent } from './login/login.component';

import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { ForgotPassComponent } from './forgot/forgot-pass.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'trang-chu',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'khach-hang',
        loadChildren: './pages/customers/customers.module#CustomersModule'
      },
      {
        path: 'hang-hoa',
        loadChildren: './pages/products/products.module#ProductsModule'
      },
      {
        path: 'hoa-don',
        loadChildren: './pages/invoices/invoices.module#InvoicesModule'
      },
      {
        path: 'thong-tin',
        loadChildren: './pages/info/info.module#InfoModule'
      },
      {
        path: 'bao-cao',
        loadChildren: './pages/report/report.module#ReportModule'
      }
    ]
  },
  {
    path: 'dang-nhap',
    component: LoginComponent,
    data: { title: 'Thông tin đăng nhập' }
  },
  {
    path: 'public/doi-mat-khau',
    component: ForgotPassComponent,
    data: { title: 'Reset mật khẩu' }
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: { title: 'Xin lỗi, Trang không tồn tại!!!' }
  },
  {
    path: '4xx',
    component: BadRequestComponent,
    data: { title: 'Xin lỗi, Server không xử lý yêu cầu!!!' }
  },
  {
    path: '500',
    component: ServerErrorComponent,
    data: { title: 'Xin lỗi, Đã có lỗi xảy ra!!!' }
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
