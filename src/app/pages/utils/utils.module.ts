import { ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';

import { BulkApproveComponent } from './bulk-approve.component';

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
    SharedModule
  ],
  declarations: [
    BulkApproveComponent
  ]
})
export class UtilsModule { }
