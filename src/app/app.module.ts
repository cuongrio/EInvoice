import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { CustomersModule } from './customers/customers.module';
import { GoodsModule } from './goods/goods.module';
import { InvoicesModule } from './invoices/invoices.module';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,

    HomeModule,
    AboutModule,
    LoginModule,
    CustomersModule,
    GoodsModule,
    InvoicesModule,

    AppRoutingModule
  ],
  declarations: [AppComponent, Page404Component, Page500Component],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
