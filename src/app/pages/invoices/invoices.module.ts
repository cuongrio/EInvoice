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
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SelectModule } from 'ng2-select';

import { NgxCurrencyModule } from 'ngx-currency';
import { UtilsService } from '@app/_services/utils/utils.service';
import { HttpClientModule } from '@angular/common/http';

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
    NgbModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),

    SharedModule
  ],
  declarations: [InvoicesComponent, InvoiceFormComponent],
  providers: [ValidationService, InvoiceService, GoodService, CustomerService, UtilsService, DatePipe]
})
export class InvoicesModule {}
