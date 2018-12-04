import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import page
import { PageLayoutComponent } from './pages/page-layout.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageLayoutComponent,
     canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'customers',
        loadChildren: './pages/customers/customers.module#CustomersModule'
      },
      {
        path: 'products',
        loadChildren: './pages/products/products.module#ProductsModule'
      },
      {
        path: 'invoices',
        loadChildren: './pages/invoices/invoices.module#InvoicesModule'
      },
      {
        path: 'info',
        loadChildren: './pages/info/info.module#InfoModule'
      },
      {
        path: 'report',
        loadChildren: './pages/report/report.module#ReportModule'
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
