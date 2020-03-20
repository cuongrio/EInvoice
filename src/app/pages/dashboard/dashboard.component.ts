import { Component, OnInit } from '@angular/core';
import { InvoiceRangeData, StatisticData } from '@model/index';
import { DashboardService } from '@service/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public statisticData: StatisticData;
  public invoiceRangeData: InvoiceRangeData[];
  public linkApprove: string;
  public linkSign: string;

  constructor(
    private dashboardService: DashboardService,
  ) {
    this.statisticData = new StatisticData();
    this.invoiceRangeData = new Array<InvoiceRangeData>();
    this.linkApprove = 'javascript:void(0)';
    this.linkSign = 'javascript:void(0)';
  }

  ngOnInit() {
    this.dashboardService.statistics()
      .subscribe((data: any) => {
        this.statisticData = data;
        if (data._links
          && data._links.pendingApprove
          && data._links.pendingApprove.href
        ) {
          this.linkApprove = data._links.pendingApprove.href;
        }
        if (data._links
          && data._links.pendingSign
          && data._links.pendingSign.href
        ) {
          this.linkSign = data._links.pendingSign.href;
        }
      });

    this.dashboardService.invoiceRanges()
      .subscribe((data: any) => {
        this.invoiceRangeData = data as InvoiceRangeData[];
      });
  }

  public formatCurrency(priceStr: string) {
    const price = +priceStr;
    if (price > 0) {
      return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    return price;
  }
}
