import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@core/authentication/authentication.guard';

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
import { ROUTE } from './constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'trang-chu',
        component: DashboardComponent,
        pathMatch: 'full',
        data: { title: 'Trang chủ' }
      }, {
        path: 'danh-muc',
        component: MenuComponent,
        data: { title: 'Danh mục' }
      },
      {
        path: 'khach-hang',
        component: CustomerComponent,
        data: { title: 'Danh mục khách hàng' }
      }, {
        path: 'thong-tin',
        component: InfoComponent,
        data: { title: 'Thông tin công ty' }
      }, {
        path: `${ROUTE.invoice}`,
        component: InvoiceComponent,
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: `${ROUTE.invoice}/${ROUTE.refresh}`,
        component: InvoiceComponent,
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: `${ROUTE.invoice}/${ROUTE.create}`,
        component: InvoiceFormComponent,
        data: { title: 'Tạo mới hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.create}/${ROUTE.refresh}`,
        component: InvoiceFormComponent,
        data: { title: 'Tạo mới hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.copy}/:id`,
        component: InvoiceFormComponent,
        data: { title: 'Tạo mới từ hóa đơn sao chép' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id`,
        component: InvoiceFormComponent,
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.adjust}`,
        component: InvoiceFormComponent,
        data: { title: 'Điều chỉnh hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.replace}`,
        component: InvoiceFormComponent,
        data: { title: 'Thay thế hóa đơn' }
      }, {
        path: `${ROUTE.invoice}/${ROUTE.detail}/:id/${ROUTE.refresh}`,
        component: InvoiceFormComponent,
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: `${ROUTE.good}`,
        component: ProductComponent,
        data: { title: 'Danh mục hàng hóa' }
      }, {
        path: `${ROUTE.report}/thong-ke`,
        component: StatisticComponent,
        data: { title: 'Bảng báo cáo | thống kê' }
      }, {
        path: `${ROUTE.report}/bang-ke`,
        component: ManifestComponent,
        data: { title: 'Bảng báo cáo | bảng kê' }
      }, {
        path: `${ROUTE.setting}/${ROUTE.invoice}`,
        component: SettingInvoiceComponent,
        data: { title: 'Thiết lập hóa đơn' }
      },
      {
        path: `${ROUTE.setting}/tuy-chinh`,
        component: SettingCustomComponent,
        data: { title: 'Thiết lập tùy chỉnh' }
      }, {
        path: `${ROUTE.utils}/duyet-theo-lo`,
        component: BulkApproveComponent,
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
