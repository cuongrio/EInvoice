import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { AppDirectiveModule } from '@app/_directives/directive.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule, BsDatepickerModule } from 'ngx-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { InfoRoutes } from './info.routing';
import { InfoComponent } from './info.component';
import { AppService } from './../../_services/core/app.service';

@NgModule({
  imports: [

  CommonModule, 
    RouterModule.forChild(InfoRoutes),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppDirectiveModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  providers: [
    AppService
  ],
  declarations: [InfoComponent]
})
export class InfoModule {}
