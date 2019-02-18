import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from 'ngx-bootstrap';

import { InvoicesRoutes } from './invoices.routing';
import { DatePipe } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';

import { InvoiceService, ValidationService, GoodService, CustomerService } from './../../_services';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { UtilsService } from '@app/_services/utils/utils.service';
import { ForgotPassService } from './../../_services/core/forgot.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { AppDirectiveModule } from '@app/_directives/directive.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InvoicesRoutes),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SelectDropDownModule,
    HttpClientModule,
    NgSelectModule,
    AlertModule.forRoot(),
    NgbModule,
    NgxCurrencyModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AppDirectiveModule,
    SharedModule
  ],
  declarations: [InvoicesComponent, InvoiceFormComponent],
  providers: [
    ValidationService,
    ForgotPassService,
    InvoiceService,
    GoodService,
    CustomerService,
    UtilsService,
    DatePipe
  ]
})
export class InvoicesModule { }
