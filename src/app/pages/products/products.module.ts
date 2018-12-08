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
import { SelectModule } from 'ng2-select';

import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from '@app/_services/utils/utils.service';
import { ProductsComponent } from './products.component';
import { ProductFormComponent } from './components/form.component';
import { ValidationService, GoodService } from '@app/_services';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild(ProductsRoutes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    SelectModule,
    HttpClientModule,
    AlertModule.forRoot(),
    NgbModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),

    SharedModule
  ],
  entryComponents: [ProductFormComponent],
  declarations: [ProductsComponent, ProductFormComponent],
  providers: [GoodService, UtilsService, DatePipe, ValidationService]
})
export class ProductsModule {}
