import { Routes } from '@angular/router';

import { ReportComponent } from './report.component';

export const ReportRoutes: Routes = [
  {
    path: '',
    component: ReportComponent,
    data: { title: 'Bảng báo cáo | thống kê' }
  }
];
