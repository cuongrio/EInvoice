import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutes } from './dashboard.routing';

import { DashboardService } from './../../_services/app/dashboard.service';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(DashboardRoutes), FormsModule, ReactiveFormsModule],
  declarations: [DashboardComponent],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
