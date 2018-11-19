// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';

// vendor module
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
// import { SlimScroll } from 'angular-io-slimscroll';
import { SharedModule } from '@app/shared';

// list page routes
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './pages/page-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { Page404Component } from './page404/page404.component';
import { Exception500Component } from './exception/exception-500.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    Page404Component,
    Exception500Component,
    MaintenanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    NgProgressModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressRouterModule.forRoot(),
    NgProgressHttpModule.forRoot()
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
