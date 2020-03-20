import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/index';

import { ForgotPassComponent } from './forgot-pass.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ForgotPassComponent
  ]
})
export class ForgotPassModule { }
