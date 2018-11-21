import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReportRoutes } from './report.routing';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ReportRoutes)],
  declarations: [ReportComponent]
})
export class ReportModule {}
