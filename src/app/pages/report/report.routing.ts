import { Routes } from '@angular/router';
import { StatisticComponent } from './statistic/statistic.component';
import { ManifestComponent } from './manifest/manifest.component';
export const ReportRoutes: Routes = [
  {
    path: 'thong-ke',
    component: StatisticComponent,
    data: { title: 'Bảng báo cáo | thống kê' }
  }, {
    path: 'bang-ke',
    component: ManifestComponent,
    data: { title: 'Bảng báo cáo | bảng kê' }
  }
];
