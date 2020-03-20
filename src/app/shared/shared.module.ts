import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlertComponent } from './alert/alert.component';
import { ControlMessageComponent } from './control-message/control-message.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule
  ],
  declarations: [
    LoaderComponent, 
    HeaderComponent, 
    FooterComponent, 
    ControlMessageComponent, 
    AlertComponent],
  entryComponents: [
    AlertComponent
  ],
  exports: [
    LoaderComponent, 
    HeaderComponent, 
    FooterComponent, 
    ControlMessageComponent,
     AlertComponent
    ]
})
export class SharedModule {}
