import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {UtilRoutes} from './utils.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { BulkApproveComponent } from './bulk-approve/bulk-approve.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UtilRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  declarations: [BulkApproveComponent]
})
export class UtilModule {}
