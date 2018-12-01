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
import { APIService } from './../../_services';
import { AppConfig } from './../../app.config';
import { AutofocusDirective } from './../../_directives/autofocus.directive';
import { SlTruncatePipe } from './../../_directives/sl_truncate.directive';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SelectModule } from 'ng2-select';

import { HttpClientModule } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';

import { NgxCurrencyModule } from 'ngx-currency';
import { UtilsService } from '@app/_services/utils.service';
import { CustomersComponent } from './customers.component';
import { CustomerFormComponent } from './components/form.component';
import { CustomersRoutes } from './customers.routing';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild(CustomersRoutes),
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
  entryComponents: [
    CustomerFormComponent
  ],
  declarations: [ 
    CustomersComponent,
    CustomerFormComponent
  ],
  providers: [APIService, UtilsService, DatePipe, AppConfig]
})
export class CustomersModule { }
