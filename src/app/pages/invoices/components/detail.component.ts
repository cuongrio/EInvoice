import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from './../../../_services/api.service';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './detail.component.html'
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  public invoiceDetail: any;
  private subscription: Subscription;

  constructor(private apiService: APIService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        // this.retrieveById(params.id);
      } else {
        // this.router.navigate(['/404']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // get detail of teacher
  private retrieveById(invoiceId: number) {
    this.apiService.retrieveInvoiceById(invoiceId).subscribe(
      response => {
        this.invoiceDetail = response;
      },
      error => {
        this.router.navigate(['/500']);
      }
    );
  }
}
