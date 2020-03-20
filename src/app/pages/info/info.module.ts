import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { InfoComponent } from './info.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
  ], 
  declarations: [
    InfoComponent
  ]
})
export class InfoModule { }
