// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { TranslateModule } from '@ngx-translate/core';

// vendor module
import { NgProgressModule } from '@ngx-progressbar/core';
import { AlertModule } from 'ngx-bootstrap';
import { SharedModule } from '@app/shared';

// list page routes
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './pages/page-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotFoundComponent } from './exception/not-found.component';
import { BadRequestComponent } from './exception/bad-request.component';
import { ServerErrorComponent } from './exception/server-error.component';

import { NumberDirective } from '@app/_directives/number_only.directive';
import { AutofocusDirective } from './_directives/autofocus.directive';
import { SlTruncatePipe } from './_directives/sl_truncate.directive';
import { ValidationService } from './_services';

import { CookieService } from 'ngx-cookie-service';
import { AppService } from './_services/core/app.service';
import { CoreModule } from './core/core.module';
import { HttpService } from './core/http/http.service';
import { AppConstant } from './_mock/mock.data';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    NotFoundComponent,
    ServerErrorComponent,
    BadRequestComponent,
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
    NgProgressModule.forRoot()
  ],

  providers: [
    ValidationService,
    CookieService,
    HttpService,
    AppService,
    AppConstant
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
