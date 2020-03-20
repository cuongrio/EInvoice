import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { SharedModule } from '@shared/shared.module';

import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvoiceModule } from './invoice/invoice.module';
import { MenuModule } from './menu/menu.module';
import { PageComponent } from './page.component';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { SettingModule } from './settings/setting.module';
import { UtilsModule } from './utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoadingBarModule,
    RouterModule, 
    CustomerModule,
    DashboardModule,
    UtilsModule,
    SettingModule,
    ReportModule,
    ProductModule,
    MenuModule,
    InvoiceModule
  ],
  declarations: [
    PageComponent
  ]
})
export class PageModule {

}
