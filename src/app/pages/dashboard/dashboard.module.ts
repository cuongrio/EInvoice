import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ 
  CommonModule,
    RouterModule
  ], 
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
