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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppDirectiveModule,
    SharedModule
  ],
  providers: [ReportService],
  declarations: [ManifestComponent, StatisticComponent]
})
export class ReportModule {}
