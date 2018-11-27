import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItem, SelectItem } from '@app/_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { APIService } from '@app/_services/api.service';

declare var $: any;
type ArrayObject = Array<SelectItem>;

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public addForm: FormGroup;
  public invoiceItem: any;
  public columNo = 12;
  public modalRef: BsModalRef;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-default' };

  configSelect = {
    displayKey: 'value',
    placeholder: '...',
    search: false,
    limitTo: 5
  };

  configFind = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có kết quả',
    moreText: 'Xem thêm',
    placeholder: '...',
    displayKey: 'name',
    search: true,
    limitTo: 5
  };

  options = [{
    '_id': '5a66d6c31d5e4e36c7711b7a',
    'index': 0,
    'balance': '$2,806.37',
    'picture': 'http://placehold.it/32x32',
    'name': 'Burns Dalton'
  }];

  // combobox
  public taxRateCombo: Array<SelectItem>;
  public serialArr: [];

  private subscription: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.initRouter();
    this.createItemsForm();
    this.formSetDefault();
    this.loadReferences();
    for (let i = 0; i < 5; i++) {
      this.stickyButtonAdd();
    }
  }

  ngAfterViewInit() {
    $('select').select2({ minimumResultsForSearch: Infinity });
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

  private createCollections(db: any) {
    db.currentTarget.result.createObjectStore('references');
  }

  private loadReferences() {
    this.apiService.getReferences().subscribe(items => {
      const selectItems = items as SelectItem[];
      this.taxRateCombo = new Array<SelectItem>();
      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectItem();
        Object.assign(selectItem, selectItems[i]);
        console.log(selectItem.type);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.taxRateCombo.push(selectItem);
        }
      }
      console.log(JSON.stringify(this.taxRateCombo));
    });

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

  private formSetDefault() {
    this.addForm.patchValue({
      invoice_date: new Date()
    });
  }
}
