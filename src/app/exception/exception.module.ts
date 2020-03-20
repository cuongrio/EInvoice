import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/index';
import { NotFoundComponent } from './not-found.component';
import { ServerErrorComponent } from './server-error.component';
import { BadRequestComponent } from './bad-request.component';
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    BadRequestComponent
  ]
})
export class ExceptionModule { }
