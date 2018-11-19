import { Routes } from '@angular/router';

import { InvoicesComponent } from './invoices.component';

export const InvoicesRoutes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    data: { title: 'Danh mục hóa đơn' }
  }
];
