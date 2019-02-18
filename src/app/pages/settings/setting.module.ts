import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SettingRoutes } from './setting.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import {SettingCustomComponent} from './setting-custom/setting-custom.component';
import {SettingInvoiceComponent} from './setting-invoice/setting-invoice.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SettingRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  declarations: [SettingCustomComponent, SettingInvoiceComponent]
})
export class SettingModule {}
