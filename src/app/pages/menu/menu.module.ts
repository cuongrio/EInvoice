import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuComponent } from './menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    NgbPaginationModule.forRoot(),
    NgSelectModule,
    SharedModule
  ],
  declarations: [
    MenuComponent
  ]
})
export class MenuModule { }
