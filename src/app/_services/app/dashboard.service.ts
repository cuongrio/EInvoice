import { Injectable } from '@angular/core';
import { AppService } from '@app/_services/core/app.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private appService: AppService) { }

    // CUSTOMERS
    statistics() {
        return this.appService.get(`/dashboard/statistics/invoice`);
    }

    invoiceRanges() {
        return this.appService.get(`/dashboard/statistics/range`);
    }
}
