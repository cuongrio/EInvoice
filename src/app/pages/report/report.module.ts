import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportRoutes } from './report.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManifestComponent } from './manifest/manifest.component';
import { StatisticComponent } from './statistic/statistic.component';
import { ReportService } from '@app/_services/app/report.service';
import { SharedModule } from '@app/shared';
import { AppDirectiveModule } from '@app/_directives/directive.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppDirectiveModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  providers: [ReportService],
  declarations: [ManifestComponent, StatisticComponent]
})
export class ReportModule {}
