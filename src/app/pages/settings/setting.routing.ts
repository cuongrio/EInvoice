import { Routes } from '@angular/router';

import {SettingCustomComponent} from './setting-custom/setting-custom.component';
import {SettingInvoiceComponent} from './setting-invoice/setting-invoice.component';

export const SettingRoutes: Routes = [
  {
    path: 'hoa-don',
    component: SettingInvoiceComponent,
    data: { title: 'Thiết lập hóa đơn' }
  },
  {
    path: 'tuy-chinh',
    component: SettingCustomComponent,
    data: { title: 'Thiết lập tùy chỉnh' }
  }
];
