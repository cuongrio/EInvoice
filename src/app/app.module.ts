// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';

// vendor module
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { AlertModule } from 'ngx-bootstrap';
import { SharedModule } from '@app/shared';

// list page routes
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './pages/page-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { Page404Component } from './page404/page404.component';
import { Exception500Component } from './exception/exception-500.component';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { NumberDirective } from '@app/_directives/number_only.directive';
import { AutofocusDirective } from './_directives/autofocus.directive';
import { SlTruncatePipe } from './_directives/sl_truncate.directive';
import { ValidationService } from './_services';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    Page404Component,
    Exception500Component,
    NumberDirective,
    AutofocusDirective,
    SlTruncatePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgProgressModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    AlertModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressRouterModule.forRoot(),
    NgProgressHttpModule.forRoot()
  ],

  providers: [
    ValidationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
