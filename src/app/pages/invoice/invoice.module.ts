import { ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';

import { InvoiceFormComponent } from './form.component';
import { InvoiceComponent } from './invoice.component';
import {
    ConfirmDocComponent, DisposeComponent, DisposeDocComponent, TokensComponent, WsErrComponent, ConfirmApproveComponent
} from './modal/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbPaginationModule.forRoot(),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule,
    NgxCurrencyModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    InvoiceComponent,
    InvoiceFormComponent,

    // modal
    TokensComponent,
    WsErrComponent,
    ConfirmDocComponent,
    ConfirmApproveComponent,
    // created
    DisposeComponent,
    // after created
    DisposeDocComponent
  ],
  entryComponents: [
    TokensComponent,
    WsErrComponent,
    ConfirmDocComponent,
    ConfirmApproveComponent,
    DisposeComponent,
    DisposeDocComponent
  ]
})
export class InvoiceModule { }
