import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItem } from './../../../_models';

declare var $: any;

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html'
})
export class InvoiceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public addForm: FormGroup;
  public invoiceItem: any;
  public columNo = 11;

  private subscription: Subscription;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.initRouter();
    this.createItemsForm();

    for (let i = 0; i < 5; i++) {
      this.stickyButtonAdd();
    }
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    $('[data-toggle="tooltip"]').on('click', function () {
      $(this).tooltip('hide');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  onSubmit(form: any) {
    console.log(JSON.stringify(form));
  }

  get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  deleteLineClicked(idx: number) {
    this.stickyButtonDelete(idx);
  }

  addMoreLineClicked() {
    this.stickyButtonAdd();
  }

  private initRouter() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      console.log('params: ' + params);
      if (params.id) {
        // get service
        this.invoiceItem = {};
        this.invoiceItem.invoice_id = params.id;
      } else {
        this.invoiceItem = {};
      }
    });
  }

  private stickyButtonAdd() {
    const emptyProductLine: ProductItem = {
      item_code: '',
      item_name: '',
      quantity: '',
      unit: '',
      price: '',
      price_wt: '',
      vat: '',
      total_vat: '',
      total_price: '',
      status: ''
    };

    const fg = this.formBuilder.group(emptyProductLine);
    this.itemFormArray.push(fg);
  }

  private stickyButtonDelete(idx: number) {
    this.itemFormArray.removeAt(idx);
  }

  // https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example

  private createItemsForm() {
    this.addForm = this.formBuilder.group({
      invoice_date: '',
      form: '',
      serial: '',
      totalBeforeTax: '',
      total_tax: '',
      total: '',
      customer: this.formBuilder.group({
        customer_name: '',
        org: '',
        tax_code: '',
        bank_account: '',
        bank: '',
        address: ''
      }),
      items: this.formBuilder.array([])
    });
  }
}
