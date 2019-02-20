import { Injectable } from '@angular/core';
import { AppService } from '@app/_services/core/app.service';
import { of } from 'rxjs';
import { AppConstant } from '@app/_mock/mock.data';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private appConstant: AppConstant, private appService: AppService) { }

    // CUSTOMERS
    statistics() {
        return of(this.appConstant.statisticInvoice);
        // return this.appService.get(`/dashboard/statistics/invoice`);
    }

    invoiceRanges() {
        return of(this.appConstant.statisticRange);
        // return this.appService.get(`/dashboard/statistics/range`);
    }
}
