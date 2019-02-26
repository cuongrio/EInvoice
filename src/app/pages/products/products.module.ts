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

import { ProductsRoutes } from './products.routing';
import { DatePipe } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from '@app/_services/utils/utils.service';
import { ProductsComponent } from './products.component';
import { ProductFormComponent } from './components/form.component';
import { ValidationService, GoodService, ReferenceService } from '@app/_services';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { ProductImportExcelComponent } from './components/import-excel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProductsRoutes),
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
  entryComponents: [ProductFormComponent, ProductImportExcelComponent],
  declarations: [ProductsComponent, ProductFormComponent, ProductImportExcelComponent],
  providers: [GoodService, UtilsService, DatePipe, ValidationService, ReferenceService]
})
export class ProductsModule { }
