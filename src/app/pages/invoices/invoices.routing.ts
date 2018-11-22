import { Routes } from '@angular/router';

import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';
import { InvoiceDetailComponent } from './components/detail.component';

export const InvoicesRoutes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    data: { title: 'Danh mục hóa đơn' },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'createNew',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới hóa đơn' }
  }, {
    path: 'update/:id',
    component: InvoiceFormComponent,
    data: { title: 'Chỉnh sửa hóa đơn' }
  }, {
    path: 'retrieve/:id',
    component: InvoiceDetailComponent,
    data: { title: 'Chi tiết hóa đơn' }
  }
];
