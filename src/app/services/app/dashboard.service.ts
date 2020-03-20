import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';

@Injectable()
export class DashboardService {
    constructor(
        protected appService: AppService
    ) { }

    // CUSTOMERS
    statistics() {
        return this.appService.get(
            '/dashboard/statistics/invoice'
        );
    }

    invoiceRanges() {
        return this.appService.get(
            '/dashboard/statistics/range'
        );
    }
}
