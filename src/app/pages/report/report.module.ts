import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReportRoutes } from './report.routing';
import { ReportComponent } from './report.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  declarations: [ReportComponent]
})
export class ReportModule {}
