// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

// vendor module
import { SharedModule } from '@app/shared';

// list page routes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { ForgotPassComponent } from './forgot/forgot-pass.component';
import { ValidationService, ForgotPassService, InvoiceService, GoodService, CustomerService, UtilsService, ReferenceService } from './_services';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './_services/core/app.service';
import { CoreModule } from './core/core.module';
import { HttpService } from './core/http/http.service';
import { AppConstant } from './_mock/mock.data';
import { CommonModule, DatePipe } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AlertModule, TooltipModule, PaginationModule, BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AppDirectiveModule } from './_directives/directive.module';
import { PagesComponent } from './pages/pages.component';
import { DashboardService } from './_services/app/dashboard.service';
import { ReportService } from './_services/app/report.service';
import { ProductFormComponent } from './pages/products/components/form.component';
import { ProductImportExcelComponent } from './pages/products/components/import-excel.component';
import { CustomerFormComponent } from './pages/customers/components/form.component';
import { CustomerImportExcelComponent } from './pages/customers/components/import-excel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { InvoiceFormComponent } from './pages/invoices/components/form.component';
import { ProductsComponent } from './pages/products/products.component';
import { SettingCustomComponent } from './pages/settings/setting-custom/setting-custom.component';
import { SettingInvoiceComponent } from './pages/settings/setting-invoice/setting-invoice.component';
import { ManifestComponent } from './pages/report/manifest/manifest.component';
import { StatisticComponent } from './pages/report/statistic/statistic.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { InfoComponent } from './pages/info/info.component';
import { MenuComponent } from './pages/menu/menu.component';
import { BulkApproveComponent } from './pages/utils/bulk-approve/bulk-approve.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';

const libModules = [
  AlertModule.forRoot(),
  TranslateModule.forRoot(),
  LoadingBarModule,
  LoadingBarHttpModule,
  LoadingBarHttpClientModule,
  LoadingBarRouterModule,
  AppDirectiveModule,
  SharedModule,
  SelectDropDownModule,
  HttpClientModule,
  NgSelectModule,
  NgbModule,
  NgxCurrencyModule,
  NgxSpinnerModule,
  NgxMaskModule.forRoot(),
  TooltipModule.forRoot(),
  PaginationModule.forRoot(),
  BsDatepickerModule.forRoot(),
  ModalModule.forRoot(),
  FormsModule,
  ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpModule,
    RouterModule,
    CoreModule,
    AppRoutingModule,
    ...libModules, 
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false })
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPassComponent,
    NotFoundComponent,
    ServerErrorComponent,
    BadRequestComponent,
    DashboardComponent,
    InvoicesComponent,
    InvoiceFormComponent,
    ProductsComponent,
    ProductFormComponent,
    ProductImportExcelComponent,
    SettingCustomComponent,
    SettingInvoiceComponent,
    ManifestComponent,
    StatisticComponent,
    CustomersComponent,
    CustomerFormComponent,
    CustomerImportExcelComponent,
    InfoComponent,
    MenuComponent,
    BulkApproveComponent,
    PagesComponent 
  ],
  entryComponents: [
    ProductFormComponent,
    ProductImportExcelComponent,
    CustomerFormComponent,
    CustomerImportExcelComponent
  ],
  providers: [
    ValidationService,
    ForgotPassService,
    CookieService,
    HttpService,
    AppService,
    AppConstant,
    DashboardService,
    InvoiceService,
    GoodService,
    CustomerService,
    UtilsService,
    DatePipe,
    ReportService,
    ReferenceService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
