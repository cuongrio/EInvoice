import { Routes } from '@angular/router';

import { ProductsComponent } from './products.component';

export const ProductsRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    data: { title: 'Danh mục hàng hóa' }
  }
];
