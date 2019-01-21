import { Routes } from '@angular/router';

import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';

export const InvoicesRoutes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    data: { title: 'Danh sách hóa đơn' },
    runGuardsAndResolvers: 'always'
  }, {
    path: 'lam-moi',
    component: InvoicesComponent,
    data: { title: 'Danh sách hóa đơn' },
    runGuardsAndResolvers: 'always'
  }, {
    path: 'tao-moi',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới hóa đơn' }
  }, {
    path: 'sao-chep/:id',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới từ hóa đơn sao chép' }
  }, {
    path: 'chi-tiet/:id',
    component: InvoiceFormComponent,
    data: { title: 'Đang mở hóa đơn' }
  }, {
    path: 'chi-tiet/:id/dieu-chinh',
    component: InvoiceFormComponent,
    data: { title: 'Điều chỉnh hóa đơn' }
  }, {
    path: 'chi-tiet/:id/thay-the',
    component: InvoiceFormComponent,
    data: { title: 'Thay thế hóa đơn' }
  }, {
    path: 'chi-tiet/:id/lam-moi',
    component: InvoiceFormComponent,
    data: { title: 'Đang mở hóa đơn' }
  }
];
