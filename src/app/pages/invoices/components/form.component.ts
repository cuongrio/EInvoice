import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItem, SelectItem, Customer } from '@app/_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { APIService } from '@app/_services/api.service';
import { Good } from './../../../_models/good';

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

  public customerPicked: Customer;
  public taxCode: string;

  configSelect = {
    displayKey: 'customer_name',
    placeholder: 'Lựa chọn',
    search: false,
    limitTo: 5
  };

  public configCode = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có kết quả',
    moreText: 'Xem thêm',
    placeholder: 'Lựa chọn',
    displayKey: 'select_item',
    search: true,
    limitTo: 5
  };

  public configTaxCode = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có kết quả',
    moreText: 'Xem thêm',
    placeholder: 'Lựa chọn',
    displayKey: 'tax_code',
    search: true,
    limitTo: 5
  };

  public configGood = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có kết quả',
    moreText: 'Xem thêm',
    placeholder: 'Lựa chọn',
    displayKey: 'select_item',
    search: true,
    limitTo: 5
  };

  // combobox
  public taxRateArr: Array<SelectItem>;
  public customerArr: Array<Customer>;
  public goodArr: Array<Good>;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initRouter();
    this.createItemsForm();
    this.formSetDefault();
    this.loadReferences();
    this.loadCustomers();
    this.loadGoods();

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

  public onCustomerTaxChange(dataArr: Customer[]) {
    this.initDataForm(dataArr);
  }

  public onCustomerChange(dataArr: Customer[]) {
    this.initDataForm(dataArr);
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

  private loadGoods() {
    this.apiService.getGoods().subscribe(items => {
      const goods = items as Good[];
      this.goodArr = new Array<Good>();

      for (let i = 0; i < goods.length; i++) {
        const good = new Good();
        Object.assign(good, goods[i]);
        good.select_item = good.goods_code + '-' + good.goods_name;
        this.goodArr.push(good);
      }

      console.log(JSON.stringify(this.goodArr));

    });
  }

  private loadCustomers() {
    this.apiService.getCustomers().subscribe(items => {
      const customers = items as Customer[];
      this.customerArr = new Array<Customer>();

      for (let i = 0; i < customers.length; i++) {
        const customer = new Customer();
        Object.assign(customer, customers[i]);
        customer.select_item = customer.customer_code + '-' + customer.customer_name;
        this.customerArr.push(customer);
      }
    });
  }
  private loadReferences() {
    this.apiService.getReferences().subscribe(items => {
      const selectItems = items as SelectItem[];
      this.taxRateArr = new Array<SelectItem>();

      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectItem();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.taxRateArr.push(selectItem);
        }
      }
    });
  }

  private initDataForm(dataArr: Customer[]) {
    if (dataArr && dataArr.length > 0) {
      const customerPicked = dataArr[0];

      // set form value
      this.addForm.patchValue({
        customer_email: customerPicked.email,
        customer_org: customerPicked.org,
        customer_bank_account: customerPicked.bank_account,
        customer_bank: customerPicked.bank,
        customer_address: customerPicked.address,
      });

      this.taxCode = customerPicked.tax_code;
      console.log(JSON.stringify(customerPicked));

    } else {
      this.addForm.patchValue({
        customer_email: '',
        customer_org: '',
        customer_bank_account: '',
        customer_bank: '',
        customer_address: '',
      });
    }
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
      customer: ['', Validators.compose([
        Validators.required
      ]
      )],
      customer_email: '',
      customer_org: '',
      customer_bank_account: '',
      customer_bank: '',
      customer_address: '',
      items: this.formBuilder.array([])
    });
  }

  private formSetDefault() {
    this.addForm.patchValue({
      invoice_date: new Date()
    });
  }
}
