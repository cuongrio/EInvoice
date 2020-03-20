import { ModalModule } from 'ngx-bootstrap'; 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';

import { ProductFormComponent } from './form.component';
import { ProductImportExcelComponent } from './import-excel.component';
import { ProductComponent } from './product.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    ModalModule.forRoot(),
    NgbPaginationModule.forRoot(),
    NgSelectModule,
    SharedModule,
    NgxCurrencyModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    ProductComponent,
    ProductFormComponent,
    ProductImportExcelComponent
  ],
  entryComponents: [
    ProductFormComponent,
    ProductImportExcelComponent
  ],
})
export class ProductModule { }
