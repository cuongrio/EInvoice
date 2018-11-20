import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersRoutes } from './customers.routing';

import { CustomersComponent } from './customers.component';
import { CustomerFormComponent } from './components/form.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(CustomersRoutes), FormsModule, ReactiveFormsModule],
  declarations: [CustomersComponent, CustomerFormComponent]
})
export class CustomersModule {}
