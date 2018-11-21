import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoicesRoutes } from './invoices.routing';
import { DatePipe } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoiceFormComponent } from './components/form.component';
import { APIService } from './../../_services';
import { AppConfig } from './../../app.config';
import { InvoiceDetailComponent } from './components/detail.component';
import { AutofocusDirective } from './../../_directives/autofocus.directive';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(InvoicesRoutes), NgbModule, FormsModule, ReactiveFormsModule],
  declarations: [AutofocusDirective, InvoicesComponent, InvoiceDetailComponent, InvoiceFormComponent],
  providers: [APIService, DatePipe, AppConfig]
})
export class InvoicesModule {}
