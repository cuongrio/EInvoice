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
    path: 'refresh',
    component: InvoicesComponent,
    data: { title: 'Danh sách hóa đơn' },
    runGuardsAndResolvers: 'always'
  }, {
    path: 'createNew',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới hóa đơn' }
  }, {
    path: 'copy/:id',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới từ hóa đơn sao chép' }
  }, {
    path: 'open/:id',
    component: InvoiceFormComponent,
    data: { title: 'Đang mở hóa đơn' }
  }, {
    path: 'open/:id/adjust',
    component: InvoiceFormComponent,
    data: { title: 'Điều chỉnh hóa đơn' }
  }, {
    path: 'open/:id/replace',
    component: InvoiceFormComponent,
    data: { title: 'Thay thế hóa đơn' }
  }, {
    path: 'open/:id/refresh',
    component: InvoiceFormComponent,
    data: { title: 'Đang mở hóa đơn' }
  }
];
