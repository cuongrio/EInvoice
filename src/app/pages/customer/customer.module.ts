import { ModalModule } from 'ngx-bootstrap'; 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';

import { CustomerComponent } from './customer.component';
import { CustomerFormComponent } from './form.component';
import { CustomerImportExcelComponent } from './import-excel.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    ModalModule.forRoot(),
    NgSelectModule,
    NgbPaginationModule.forRoot(),
    SharedModule
  ],
  declarations: [
    CustomerComponent,
    CustomerFormComponent,
    CustomerImportExcelComponent
  ],
  entryComponents: [
    CustomerFormComponent,
    CustomerImportExcelComponent
  ],
})
export class CustomerModule { }
