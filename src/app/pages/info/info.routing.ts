import { Routes } from '@angular/router';

import { InfoComponent } from './info.component';

export const InfoRoutes: Routes = [
  {
    path: '',
    component: InfoComponent,
    data: { title: 'Thông tin công ty' }
  }
];
