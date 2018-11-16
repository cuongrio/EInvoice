import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, CustomersRoutingModule],
  declarations: [CustomersComponent]
})
export class CustomersModule {}
