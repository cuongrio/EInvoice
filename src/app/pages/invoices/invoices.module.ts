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

import { InvoicesRoutes } from './invoices.routing';
import { DatePipe } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';
import { APIService } from './../../_services';
import { AppConfig } from './../../app.config';
import { InvoiceDetailComponent } from './components/detail.component';
import { AutofocusDirective } from './../../_directives/autofocus.directive';
import { SlTruncatePipe } from './../../_directives/sl_truncate.directive';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ClickOutsideModule } from 'ng-click-outside';

import { HttpClientModule } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(InvoicesRoutes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    ClickOutsideModule,
    HttpClientModule,
    NgProgressModule.forRoot(),
    NgbModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [AutofocusDirective, SlTruncatePipe, InvoicesComponent, InvoiceDetailComponent, InvoiceFormComponent],
  providers: [APIService, DatePipe, AppConfig]
})
export class InvoicesModule {}
