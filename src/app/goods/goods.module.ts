import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsComponent } from './goods.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, GoodsRoutingModule],
  declarations: [GoodsComponent]
})
export class GoodsModule {}
