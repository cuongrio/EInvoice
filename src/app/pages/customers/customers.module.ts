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

import { DatePipe } from '@angular/common';
import { CustomerService, ValidationService } from './../../_services';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { HttpClientModule } from '@angular/common/http';

import { UtilsService } from '@app/_services/utils/utils.service';
import { CustomersComponent } from './customers.component';
import { CustomerFormComponent } from './components/form.component';
import { CustomersRoutes } from './customers.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,

    CommonModule,

    RouterModule.forChild(CustomersRoutes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    HttpClientModule,
    AlertModule.forRoot(),
    NgbModule,
    NgSelectModule,
    AlertModule.forRoot(),
    NgbModule,
    NgxCurrencyModule,
    NgxSpinnerModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  entryComponents: [CustomerFormComponent],
  declarations: [CustomersComponent, CustomerFormComponent],
  providers: [CustomerService, UtilsService, DatePipe, ValidationService]
})
export class CustomersModule {}
