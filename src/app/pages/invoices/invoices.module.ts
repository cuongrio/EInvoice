import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from 'ngx-bootstrap';

import { InvoicesRoutes } from './invoices.routing';
import { DatePipe } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';
import { InvoiceService, ValidationService, GoodService, CustomerService } from './../../_services';
import { AppConfig } from './../../app.config';
import { InvoiceDetailComponent } from './components/detail.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SelectModule } from 'ng2-select';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgxCurrencyModule } from 'ngx-currency';
import { UtilsService } from '@app/_services/utils/utils.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from '@app/_helpers';

@NgModule({
  imports: [

    CommonModule,

    RouterModule.forChild(InvoicesRoutes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    SelectModule,
    HttpClientModule,
    AlertModule.forRoot(),
    NgxCurrencyModule,
    NgProgressModule.forRoot(),
    NgbModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),

    SharedModule
  ],
  declarations: [
    InvoicesComponent,
    InvoiceDetailComponent,
    InvoiceFormComponent
  ],
  providers: [
    ValidationService,
    InvoiceService,
    GoodService,
    CustomerService,
    UtilsService,
    DatePipe,
    AppConfig,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class InvoicesModule { }
