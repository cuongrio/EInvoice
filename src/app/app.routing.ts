import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';

import { ROUTE } from './constant';
import { BadRequestComponent } from './exception/bad-request.component';
import { NotFoundComponent } from './exception/not-found.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { ForgotPassComponent } from './forgot/forgot-pass.component';
import { LoginComponent } from './login/login.component';
// import page
import {
    BulkApproveComponent, CustomerComponent, DashboardComponent, InfoComponent, InvoiceComponent,
    ManifestComponent, MenuComponent, PageComponent, ProductComponent, SettingCustomComponent,
    SettingInvoiceComponent, StatisticComponent
} from './pages';
import { InvoiceFormComponent } from './pages/invoice/form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'trang-chu',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full',
        data: { title: 'Trang chủ' }
      }, {
        path: 'danh-muc',
        component: MenuComponent,
        canActivate: [AuthGuard],
        data: { title: 'Danh mục' }
      },
      {
        path: 'khach-hang',
        component: CustomerComponent,
        canActivate: [AuthGuard],
        data: { title: 'Danh mục khách hàng' }
      }, {
        path: 'thong-tin',
        component: InfoComponent,
        canActivate: [AuthGuard],
        data: { title: 'Thông tin công ty' }
      }, {
        path: `${ROUTE.invoice}`,
        component: InvoiceComponent,
        canActivate: [AuthGuard],
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: `${ROUTE.invoice}/${ROUTE.refresh}`,
        component: InvoiceComponent,
        canActivate: [AuthGuard],
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: `${ROUTE.invoice}/${ROUTE.create}`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Tạo mới hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.create}/${ROUTE.refresh}`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Tạo mới hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.copy}/:id`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Tạo mới từ hóa đơn sao chép' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.adjust}`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Điều chỉnh hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.replace}`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Thay thế hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.refresh}`,
        component: InvoiceFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: `${ROUTE.good}`,
        component: ProductComponent,
        canActivate: [AuthGuard],
        data: { title: 'Danh mục hàng hóa' }
      }, {
        path: `${ROUTE.report}/thong-ke`,
        component: StatisticComponent,
        data: { title: 'Bảng báo cáo | thống kê' }
      }, {
        path: `${ROUTE.report}/bang-ke`,
        component: ManifestComponent,
        canActivate: [AuthGuard],
        data: { title: 'Bảng báo cáo | bảng kê' }
      }, {
        path: `${ROUTE.setting}/${ROUTE.invoice}`,
        component: SettingInvoiceComponent,
        canActivate: [AuthGuard],
        data: { title: 'Thiết lập hóa đơn' }
      },
      {
        path: `${ROUTE.setting}/tuy-chinh`,
        component: SettingCustomComponent,
        canActivate: [AuthGuard],
        data: { title: 'Thiết lập tùy chỉnh' }
      }, {
        path: `${ROUTE.utils}/duyet-theo-lo`,
        component: BulkApproveComponent,
        canActivate: [AuthGuard],
        data: { title: 'Bảng báo cáo | thống kê' }
      }
    ]
  },
  {
    path: 'dang-nhap',
    component: LoginComponent, 
    data: { title: 'Thông tin đăng nhập' }
  },
  {
    path: 'doi-mat-khau',
    component: ForgotPassComponent,
    data: { title: 'Reset mật khẩu' }
  },
  {
    path: 'trang-404',
    component: NotFoundComponent,
    data: { title: 'Xin lỗi, Trang không tồn tại!!!' }
  },
  {
    path: '4xx',
    component: BadRequestComponent,
    data: { title: 'Xin lỗi, Server không xử lý yêu cầu!!!' }
  },
  {
    path: 'trang-500',
    component: ServerErrorComponent,
    data: { title: 'Xin lỗi, Đã có lỗi xảy ra!!!' }
  },
  {
    path: '**',
    redirectTo: 'trang-404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
