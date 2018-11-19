import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfoRoutes } from './info.routing';
import { InfoComponent } from './info.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(InfoRoutes)],
  declarations: [InfoComponent]
})
export class InfoModule {}
