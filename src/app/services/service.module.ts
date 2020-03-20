import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpService } from '@core/index';

import {
    AppService, CustomerService, DashboardService, ForgotPassService, GoodService, InvoiceService,
    ReferenceService, ReportService, UtilsService, ValidationService
} from './index';
import { SocketService } from './socket/socket.service';
import { TokenService } from './socket/token.service';

@NgModule({
    providers: [
        SocketService,
        ValidationService,
        ForgotPassService,
        HttpService,
        AppService,
        DashboardService,
        InvoiceService,
        GoodService,
        CustomerService,
        UtilsService,
        DatePipe,
        ReportService,
        ReferenceService,
        TokenService
    ]
})
export class ServiceModule { }
