import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, InvoicesRoutingModule],
  declarations: [InvoicesComponent]
})
export class InvoicesModule {}
