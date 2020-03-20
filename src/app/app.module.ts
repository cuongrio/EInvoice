import { AlertModule } from 'ngx-bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
// core module
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
// vendor module  
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceModule } from '@service/service.module';

// list page routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { AppDirectiveModule } from './directives/index'; 
import { LoginModule } from './login/login.module';
import { PageModule } from './pages/page.module';
import { ForgotPassModule } from './forgot/forgot-pass.module';
import { ExceptionModule } from './exception/exception.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpModule,
    RouterModule,
    CoreModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    TranslateModule.forRoot(),
    LoadingBarHttpModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    AppDirectiveModule,
    SelectDropDownModule,
    HttpClientModule,
    PageModule,
    ForgotPassModule,
    LoginModule,
    ExceptionModule,
    ServiceModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false })
  ],
  declarations: [
    AppComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
