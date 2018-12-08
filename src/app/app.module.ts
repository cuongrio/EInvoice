// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// vendor module
import { AlertModule } from 'ngx-bootstrap';
import { SharedModule } from '@app/shared';

// list page routes
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './pages/page-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';
import { ForgotPassComponent } from './forgot/forgot-pass.component';
import { ValidationService } from './_services';

import { CookieService } from 'ngx-cookie-service';
import { AppService } from './_services/core/app.service';
import { CoreModule } from './core/core.module';
import { HttpService } from './core/http/http.service';
import { AppConstant } from './_mock/mock.data';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppDirectiveModule } from './_directives/app-directive.module';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPassComponent,
    NotFoundComponent,
    ServerErrorComponent,
    BadRequestComponent
  ],
  imports: [
  BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    TranslateModule.forRoot(),
    LoadingBarModule,
    LoadingBarHttpModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    AppDirectiveModule
  ],

  providers: [ValidationService, CookieService, HttpService, AppService, AppConstant],
  bootstrap: [AppComponent]
})
export class AppModule { }
