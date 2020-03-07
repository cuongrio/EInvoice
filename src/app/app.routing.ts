import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import page
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { ForgotPassComponent } from './forgot/forgot-pass.component';
import { PagesComponent } from './pages/pages.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { InfoComponent } from './pages/info/info.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { InvoiceFormComponent } from './pages/invoices/components/form.component';
import { ProductsComponent } from './pages/products/products.component';
import { StatisticComponent } from './pages/report/statistic/statistic.component';
import { ManifestComponent } from './pages/report/manifest/manifest.component';
import { SettingInvoiceComponent } from './pages/settings/setting-invoice/setting-invoice.component';
import { SettingCustomComponent } from './pages/settings/setting-custom/setting-custom.component';
import { BulkApproveComponent } from './pages/utils/bulk-approve/bulk-approve.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PagesComponent,
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
        component: CustomersComponent,
        data: { title: 'Danh mục khách hàng' }
      }, {
        path: 'thong-tin',
        component: InfoComponent,
        data: { title: 'Thông tin công ty' }
      }, {
        path: 'hoa-don',
        component: InvoicesComponent,
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: 'hoa-don/lam-moi',
        component: InvoicesComponent,
        data: { title: 'Danh sách hóa đơn' },
        runGuardsAndResolvers: 'always'
      }, {
        path: 'hoa-don/tao-moi',
        component: InvoiceFormComponent,
        data: { title: 'Tạo mới hóa đơn' }
      }, {
        path: 'hoa-don/sao-chep/:id',
        component: InvoiceFormComponent,
        data: { title: 'Tạo mới từ hóa đơn sao chép' }
      }, {
        path: 'hoa-don/chi-tiet/:id',
        component: InvoiceFormComponent,
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: 'hoa-don/chi-tiet/:id/dieu-chinh',
        component: InvoiceFormComponent,
        data: { title: 'Điều chỉnh hóa đơn' }
      }, {
        path: 'hoa-don/chi-tiet/:id/thay-the',
        component: InvoiceFormComponent,
        data: { title: 'Thay thế hóa đơn' }
      }, {
        path: 'hoa-don/chi-tiet/:id/lam-moi',
        component: InvoiceFormComponent,
        data: { title: 'Đang mở hóa đơn' }
      }, {
        path: 'hang-hoa',
        component: ProductsComponent,
        data: { title: 'Danh mục hàng hóa' }
      }, {
        path: 'bao-cao/thong-ke',
        component: StatisticComponent,
        data: { title: 'Bảng báo cáo | thống kê' }
      }, {
        path: 'bao-cao/bang-ke',
        component: ManifestComponent,
        data: { title: 'Bảng báo cáo | bảng kê' }
      }, {
        path: 'thiet-lap/hoa-don',
        component: SettingInvoiceComponent,
        data: { title: 'Thiết lập hóa đơn' }
      },
      {
        path: 'thiet-lap/tuy-chinh',
        component: SettingCustomComponent,
        data: { title: 'Thiết lập tùy chỉnh' }
      }, {
        path: 'tien-ich/duyet-theo-lo',
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
