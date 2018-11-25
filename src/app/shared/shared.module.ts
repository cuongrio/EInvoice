import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ControlMessageComponent } from './control-message/control-message.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    LoaderComponent,
    HeaderComponent,
    FooterComponent,
    ControlMessageComponent
  ],
  exports: [LoaderComponent,
    HeaderComponent,
    FooterComponent,
    ControlMessageComponent
  ]
})
export class SharedModule { }
