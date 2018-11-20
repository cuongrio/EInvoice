import { Routes } from '@angular/router';

import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';

export const InvoicesRoutes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    data: { title: 'Danh mục hóa đơn' },
    runGuardsAndResolvers: 'always'
  }, {
    path: 'createNew',
    component: InvoiceFormComponent,
    data: { title: 'Tạo mới hóa đơn' },
  }
];
