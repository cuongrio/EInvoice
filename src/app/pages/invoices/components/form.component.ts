import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
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

  // total price
  public totalPrice = new Array<number>();
  public totalVat = new Array<number>();
  public finalTotalPrice = new Array<number>();

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
    this.loadGoods();
    this.loadHttt();
    this.stickyButtonAdd();
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

  public addNewButtonClicked() {
    this.customerPicked = null;
    this.totalPrice = new Array<number>();
    this.totalVat = new Array<number>();
    this.finalTotalPrice = new Array<number>();
    this.clearFormArray(this.itemFormArray);
    this.addForm.reset();

    // set default
    this.formSetDefault();
    this.loadCustomers();
    this.loadGoods();
    this.stickyButtonAdd();
  }

  public onGoodlineChange(dataArr: Good[], idx: number) {
    if (dataArr && dataArr.length > 0) {
      const good = dataArr[0];
      const controlArray = <FormArray>this.addForm.get('items');
      controlArray.controls[idx].get('item_line').setValue(idx + 1);
      controlArray.controls[idx].get('item_code').setValue(good.goods_code);
      controlArray.controls[idx].get('item_name').setValue(good.goods_name);
      controlArray.controls[idx].get('unit').setValue(good.unit);
      controlArray.controls[idx].get('price').setValue(good.price);
      controlArray.controls[idx].get('tax_rate').setValue(good.tax_rate);

      this.totalPricePopulator(idx);
      this.totalVatPopulator(idx);
      this.finalTotalPricePopulator(idx);
    }
  }

  public get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  public deleteLineClicked(idx: number) {
    this.stickyButtonDelete(idx);
  }

  public addMoreLineClicked() {
    this.stickyButtonAdd();
  }


  /*** TOTAL PRICE */
  public quantityValueChange(value: number, idx: number) {
    const controlArray = <FormArray>this.addForm.get('items');
    const itemCode = controlArray.controls[idx].get('item_code').value;
    if (itemCode) {
      this.totalPricePopulator(idx, value, null);
    }
  }

  public priceValueChange(value: number, idx: number) {
    const controlArray = <FormArray>this.addForm.get('items');
    const itemCode = controlArray.controls[idx].get('item_code').value;
    if (itemCode) {
      this.totalPricePopulator(idx, null, value);
    }
  }

  public ckValueChange(value: number, idx: number) {
    const controlArray = <FormArray>this.addForm.get('items');
    const itemCode = controlArray.controls[idx].get('item_code').value;
    if (itemCode) {
      const totalPrice = this.totalPrice[idx];
      if (totalPrice && totalPrice > 0) {
        const totalCk = (totalPrice * value) / 100;
        controlArray.controls[idx].get('total_ck').setValue(totalCk);
        this.totalVatPopulator(idx, null, totalCk);
        this.finalTotalPricePopulator(idx, totalCk);
      }
    }
  }

  public totalCkValueChange(value: number, idx: number) {
    const controlArray = <FormArray>this.addForm.get('items');
    const itemCode = controlArray.controls[idx].get('item_code').value;
    if (itemCode) {
      const totalPrice = this.totalPrice[idx];
      if (value > 0 && totalPrice && totalPrice > 0) {
        const ck = (value * 100) / totalPrice;
        controlArray.controls[idx].get('ck').setValue(ck);
        this.finalTotalPricePopulator(idx, value);
      }
      this.totalVatPopulator(idx, null, value);
    }
  }
  /*** END TOTAL PRICE */

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
      item_line: null,
      item_code: '',
      item_name: '',
      unit: '',
      quantity: null,
      price: null,
      price_wt: null,
      ck: 0,
      total_ck: 0,
      tax_rate: 0,
      tax: null,
      total_price: null
    };

    const fg = this.formBuilder.group(emptyProductLine);
    this.itemFormArray.push(fg);
    this.totalPrice.push(null);
    this.finalTotalPrice.push(null);
    this.totalVat.push(null);
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
      items: this.formBuilder.array([])
    });
  }

  private clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private formSetDefault() {
    this.addForm.patchValue({
      invoice_date: new Date()
    });
  }

  private totalPricePopulator(idx: number, quantityVal: number = 0, priceVal: number = 0) {
    const controlArray = <FormArray>this.addForm.get('items');
    let quantity = quantityVal;
    let price = priceVal;

    if (quantity === null || quantity === 0) {
      quantity = controlArray.controls[idx].get('quantity').value;
    }
    if (price === null || price === 0) {
      price = controlArray.controls[idx].get('price').value;
    }

    if (quantity > 0 && price > 0) {
      this.totalPrice[idx] = quantity * price;
      this.totalVatPopulator(idx);
      this.finalTotalPricePopulator(idx);
    }
  }

  private totalVatPopulator(idx: number, vatVal: number = 0, totalCkVal: number = 0) {
    const totalPrice = this.totalPrice[idx];
    let vat = vatVal;
    let totalCk: number = totalCkVal;

    if (totalPrice && totalPrice > 0) {
      const controlArray = <FormArray>this.addForm.get('items');

      if (vat === null || vat === 0) {
        vat = controlArray.controls[idx].get('tax_rate').value;
      }

      if (totalCk === null || totalCk === 0) {
        totalCk = controlArray.controls[idx].get('total_ck').value;
      }

      if (vat > 0) {
        this.totalVat[idx] = ((totalPrice - totalCk) * vat) / 100;
      } else {
        this.totalVat[idx] = 0;
      }
    }
  }

  private finalTotalPricePopulator(idx: number, totalCkVal: number = 0) {
    const totalPrice = this.totalPrice[idx];
    const totalVat = this.totalVat[idx];
    if (totalPrice && totalVat) {
      this.finalTotalPrice[idx] = (totalPrice + totalVat) - totalCkVal;
    }
  }
}
