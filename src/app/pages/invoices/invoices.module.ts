import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoicesRoutes } from './invoices.routing';

import { InvoicesComponent } from './invoices.component';
import { InvoiceSearchComponent } from './components/search.component';
import { InvoiceFormComponent } from './components/form.component';
import { APIService } from '@app/services/api.service';
import { AppConfig } from './../../app.config';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InvoicesRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [InvoicesComponent, InvoiceSearchComponent, InvoiceFormComponent],
  providers: [
    APIService,
    AppConfig
  ]
})
export class InvoicesModule { }
