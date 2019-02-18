import { Routes } from '@angular/router';

import { BulkApproveComponent } from './bulk-approve/bulk-approve.component';

export const UtilRoutes: Routes = [
  {
    path: '',
    redirectTo: 'duyet-theo-lo',
    pathMatch: 'full'
  },
  {
    path: 'duyet-theo-lo',
    component: BulkApproveComponent,
    data: { title: 'Bảng báo cáo | thống kê' }
  }
];
