import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutes } from './products.routing';

import { ProductsComponent } from './products.component';
import { ProductSearchComponent } from './components/search.component';
import { ProductFormComponent } from './components/form.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ProductsRoutes), FormsModule, ReactiveFormsModule],
  declarations: [ProductsComponent, ProductSearchComponent, ProductFormComponent]
})
export class ProductsModule {}
