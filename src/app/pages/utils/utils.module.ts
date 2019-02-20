import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {UtilRoutes} from './utils.routing';

import { SharedModule } from '@app/shared';
import { AppDirectiveModule } from '@app/_directives/directive.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule, BsDatepickerModule } from 'ngx-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BulkApproveComponent } from './bulk-approve/bulk-approve.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UtilRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppDirectiveModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  declarations: [BulkApproveComponent]
})
export class UtilModule {}
