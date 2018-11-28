import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs';
import { ProductItem, SelectItem, Customer, InvoiceItem } from '@app/_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { APIService } from '@app/_services/api.service';
import { Good } from './../../../_models/good';

declare var $: any;

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
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };

  public customerPicked: Customer;
  public formPicked: string;
  public serialPicked: string;
  public total_before_tax: number;
  public total_tax: number;
  public total: number;

  public configCode = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có dữ liệu',
    moreText: 'Xem thêm',
    showNotFound: true,
    placeholder: ' ',
    toggleDropdown: true,
    displayKey: 'select_item',
    search: true,
    limitTo: 7
  };

  public configTaxCode = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có dữ liệu',
    moreText: 'Xem thêm',
    placeholder: ' ',
    displayKey: 'tax_code',
    search: true,
    limitTo: 7
  };

  public configGood = {
    searchPlaceholder: 'Tìm kiếm',
    noResultsFound: 'Không có dữ liệu',
    moreText: 'Xem thêm',
    placeholder: ' ',
    displayKey: 'select_item',
    search: true,
    limitTo: 7
  };

  public configVAT: any = {
    placeholder: '%VAT',
    sourceField: ['value']
  };

  // combobox
  public taxRateArr: Array<SelectItem>;
  public customerArr: Array<Customer>;
  public goodArr: Array<Good>;

  public comboHTTT = new Array<SelectItem>();
  public comboForm = new Array<SelectItem>();
  public comboSerial = new Array<SelectItem>();
  public comboTaxRate = new Array<SelectItem>();

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
    this.loadCustomers();
    this.loadReferences();
    this.loadSerials();
    this.loadGoods();
    this.loadHttt();

    for (let i = 0; i < 5; i++) {
      this.stickyButtonAdd();
    }
  }

  ngAfterViewInit() {
    $('select').select2({
      minimumResultsForSearch: Infinity,
      simple_tags: true,
      language: {
        noResults: function () {
          return 'Không có dữ liệu';
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  onSubmit(dataForm: any) {
    const invoiceItem = new InvoiceItem();

    invoiceItem.form = dataForm.form;
    invoiceItem.serial = dataForm.serial;
    invoiceItem.invoice_date = dataForm.invoice_date;
    invoiceItem.customer = this.customerPicked;

    // caculator





    console.log(JSON.stringify(dataForm));
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

  private loadSerials() {
    // this.serialArr = this.dummySerial();
  }

  private loadGoods() {
    if (this.goodArr && this.goodArr.length > 0) {
      return;
    }

    this.apiService.getGoods().subscribe(items => {
      const goods = items as Good[];
      this.goodArr = new Array<Good>();

      for (let i = 0; i < goods.length; i++) {
        const good = new Good();
        Object.assign(good, goods[i]);
        good.select_item = good.goods_code;
        this.goodArr.push(good);
      }
    });
  }

  private loadHttt() {
    this.comboHTTT = this.htttDummy();
    this.addForm.patchValue({
      paymentType: 'CK/TM'
    });
  }

  private loadCustomers() {
    if (this.customerArr && this.customerArr.length > 0) {
      return;
    }

    this.apiService.getCustomers().subscribe(items => {
      const customers = items as Customer[];
      this.customerArr = new Array<Customer>();

      for (let i = 0; i < customers.length; i++) {
        const customer = new Customer();
        Object.assign(customer, customers[i]);
        customer.select_item = customer.customer_code;
        this.customerArr.push(customer);
      }
    });
  }

  private loadReferences() {
    this.apiService.getReferences().subscribe(items => {
      const selectItems = items as SelectItem[];

      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectItem();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.comboTaxRate.push(selectItem);
        }

        if (selectItem.type === 'COMBO_FORM') {
          this.comboForm.push(selectItem);
        }

        if (selectItem.type === 'COMBO_SERIAL_01GTKT0/001') {
          this.comboSerial.push(selectItem);
        }
      }

      if (this.comboForm.length > 0) {
        this.formPicked = this.comboForm[0].code;
        this.addForm.patchValue({
          form: this.formPicked
        });
      }

      if (this.comboForm.length > 0) {
        this.serialPicked = this.comboSerial[0].code;
        this.addForm.patchValue({
          serial: this.serialPicked
        });
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
        customer_address: customerPicked.address
      });

      console.log(JSON.stringify(customerPicked));
    } else {
      this.addForm.patchValue({
        customer_email: '',
        customer_org: '',
        customer_bank_account: '',
        customer_bank: '',
        customer_address: ''
      });
    }
  }

  private initRouter() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
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
      item_line: 0,
      item_code: '',
      item_name: '',
      unit: '',
      price: '',
      tax: 0,
      tax_rate: 0,
      tax_rate_code: '',
      price_wt: 0,
      quantity: 0,
      amount: 0,
      amount_wt: 0,
    };

    const fg = this.formBuilder.group(emptyProductLine);
    this.itemFormArray.push(fg);
  }

  private stickyButtonDelete(idx: number) {
    this.itemFormArray.removeAt(idx);
  }

  // https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example

  private htttDummy() {
    const items = new Array<SelectItem>();
    let selectItem = new SelectItem();

    // CK/TM,CK,TM mặc định CK/TM
    selectItem.code = 'CK/TM';
    selectItem.value = 'CK/TM';
    items.push(selectItem);

    selectItem = new SelectItem();
    selectItem.code = 'CK';
    selectItem.value = 'CK';
    items.push(selectItem);

    selectItem = new SelectItem();
    selectItem.code = 'CK/TM';
    selectItem.value = 'CK/TM';
    items.push(selectItem);
    return items;
  }

  private createItemsForm() {
    this.addForm = this.formBuilder.group({
      invoice_date: '',
      form: '',
      serial: '',
      customer: ['', Validators.compose([Validators.required])],
      customer_email: '',
      customer_org: '',
      paymentType: '',
      customer_bank_account: '',
      customer_bank: '',
      customer_address: '',
      items: this.formBuilder.array([{
        item_line: '',
        item_name: '',
        unit: '',
        quantity: '',
        price: '',
        price_wt: '',
        ck: '',
        total_ck: '',
        tax_rate_code: '',
        total_tax: '',
        total_price: ''
      }])
    });
  }

  private formSetDefault() {
    this.addForm.patchValue({
      invoice_date: new Date()
    });
  }
}
