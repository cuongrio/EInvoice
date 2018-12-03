import { Component, OnInit, OnDestroy, TemplateRef, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { UtilsService } from '@app/_services/utils/utils.service';
import { InvoiceService } from './../../../_services/app/invoice.service';
import { CustomerData } from './../../../_models/data/customer.data';
import { SelectData, GoodData, InvoiceModel, ProductData, ProductModel } from '@app/_models';
import { CustomerService } from './../../../_services/app/customer.service';
import { GoodService } from '@app/_services';
import { ReferenceService } from './../../../_services/app/reference.service';

declare var $: any;

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  public invoiceId: string;
  public adjust = false;

  // button status
  public disabledAdd = true;
  public disabledEdit = true;
  public disabledSign = true;
  public disabledPrintTranform = true;
  public disabledAdjust = true;

  public addForm: FormGroup;
  public submitted = false;

  public columNo = 10;
  public modalRef: BsModalRef;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };

  public serialPicked: SelectData;
  public customerPicked: CustomerData;

  public references: Array<SelectData>;

  public noItemLine = false;

  public hiddenExColumn = true;

  public listTokenDummy = new Array<SelectData>();

  // total price
  public totalPrice = new Array<number>();
  public totalVat = new Array<number>();
  public finalTotalPrice = new Array<number>();

  public configSingleBox = {
    noResultsFound: 'Không có dữ liệu',
    showNotFound: false,
    placeholder: ' ',
    toggleDropdown: false,
    displayKey: 'select_item',
    search: false
  };

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
  public taxRateArr: Array<SelectData>;
  public customerArr: Array<CustomerData>;
  public goodArr: Array<GoodData>;

  public comboHTTT = new Array<SelectData>();
  public comboForm = new Array<SelectData>();
  public comboSerial = new Array<SelectData>();
  public comboTaxRate = new Array<SelectData>();

  private subscription: Subscription;

  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private goodService: GoodService,
    private customerService: CustomerService,
    private referenceService: ReferenceService
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

    this.listTokenDummy.push({
      code: 'token1',
      value: 'token1'
    });

    this.listTokenDummy.push({
      code: 'token2',
      value: 'token2'
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
    this.submitted = true;
    this.submitted = true;

    if (!dataForm.items) {
      this.noItemLine = true;
    } else {
      const items = dataForm.items.filter((elemnent: any, index: number, array: any) => {
        return elemnent.item_code !== null && elemnent.item_code !== '';
      });

      if (!items || items.length === 0) {
        this.noItemLine = true;
      }
    }

    if (this.addForm.invalid) {
      return;
    }

    this.noItemLine = false;
    const invoiceModel = new InvoiceModel();

    invoiceModel.form = dataForm.form;
    invoiceModel.serial = dataForm.serial;
    invoiceModel.invoice_date = dataForm.invoice_date;

    // update customer
    invoiceModel.customer = new CustomerData();
    invoiceModel.customer.customer_name = dataForm.customerName;
    invoiceModel.customer.org = dataForm.customerOrg;
    invoiceModel.customer.bank = dataForm.customerBank;
    invoiceModel.customer.bank_account = dataForm.customerBankAccount;
    invoiceModel.customer.address = dataForm.customerAddress;
    invoiceModel.customer.phone = this.customerPicked.phone;

    // paymentType
    invoiceModel.paymentType = dataForm.paymentType;

    if (dataForm.items && dataForm.items.length > 0) {
      invoiceModel.items = dataForm.items.filter((elemnent: any, index: number, array: any) => {
        return elemnent.item_code !== null && elemnent.item_code !== '';
      });
    }
    invoiceModel.total_before_tax = this.sumPriceArr(this.totalPrice);
    invoiceModel.total_tax = this.sumPriceArr(this.totalVat);
    invoiceModel.total = this.sumPriceArr(this.finalTotalPrice);

    console.log('before: ' + JSON.stringify(invoiceModel));

    return this.invoiceService.createInvoice(invoiceModel).subscribe(
      data => {
        console.log('submiited: ' + JSON.stringify(data));
      },
      err => {
        if (err.error) {
          console.log(err);
          alert(err.error.error + '!!! \n' + err.error.message);
        } else {
          alert('Đã xảy ra lỗi!!!\nVui lòng liên hệ với administrator.');
        }
      }
    );
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

  public async signInvoiceClicked(template: TemplateRef<any>) {
    let listToken: Array<any>;
    // 1. get list token
    await this.invoiceService.listToken().subscribe(data => {
      // show choice token
      listToken = data as Array<any>;
    });
    console.log('list token');
    console.log(JSON.stringify(listToken));

    // if (listToken && listToken.length > 0) {
    this.modalRef = this.modalService.show(template);
    // } else {
    //   this.signedInvoiceAction(0);
    // }
  }

  public inCDClicked() {
    const initialState = {
      message: 'Open a modal with component',
      title: 'Modal with component',
      class: 'error'
    };
    this.modalRef = this.modalService.show(AlertComponent, { initialState });
  }

  public onGoodlineChange(dataArr: GoodData[], idx: number) {
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

  public hiddenColumnClicked() {
    this.hiddenExColumn = !this.hiddenExColumn;
    if (this.hiddenExColumn) {
      this.columNo = 10;
    } else {
      this.columNo = 12;
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

  public taxRateValueChange(value: number, idx: number) {
    const controlArray = <FormArray>this.addForm.get('items');
    const itemCode = controlArray.controls[idx].get('item_code').value;
    if (itemCode) {
      this.totalVatPopulator(idx, null, null);
      this.finalTotalPricePopulator(idx, null);
    }
  }

  public onCustomerTaxChange(customerValue: any) {
    const customer = new CustomerData();
    Object.assign(customer, customerValue[0]);
    this.addForm.patchValue({
      customerTax: customer.tax_code
    });

    this.initDataForm(customer);
  }

  public onCustomerChange(customerValue: any) {
    const customer = new CustomerData();
    Object.assign(customer, customerValue[0]);
    this.addForm.patchValue({
      customerCode: customer.customer_code
    });

    this.initDataForm(customer);
  }

  public onFormChange(formValue: any) {
    const selectData = new SelectData();
    this.comboSerial = new Array<SelectData>();
    this.serialPicked = null;

    if (formValue && formValue.length > 0) {
      Object.assign(selectData, formValue[0]);
      const comboType = `COMBO_SERIAL_${selectData.code}`;

      this.references.forEach((item: SelectData, index: number) => {
        if (item.type === comboType) {
          item.select_item = item.code;
          this.comboSerial.push(item);
        }
      });
    }
    this.addForm.patchValue({
      form: selectData.code
    });
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  public onSerialChange(serialValue: any) {
    const selectData = new SelectData();
    Object.assign(selectData, serialValue[0]);
    this.addForm.patchValue({
      serial: selectData.code
    });
  }

  public loadSerialBox() {
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  public loadFormBox() {
    if (this.comboForm && this.comboForm.length > 0) {
      return;
    }
    if (!this.references) {
      this.loadReferences();
    }
  }

  getSumFinalTotal(): number {
    let sumPrice = 0;
    this.finalTotalPrice.forEach((price: number, index: number) => {
      sumPrice += price;
    });
    if (sumPrice === 0) {
      return null;
    }
    return sumPrice;
  }

  getSumVatTotal(): number {
    let sumPrice = 0;
    this.totalVat.forEach((price: number, index: number) => {
      sumPrice += price;
    });
    if (sumPrice === 0) {
      return null;
    }
    return sumPrice;
  }

  getSumTotalPrice(): number {
    let sumPrice = 0;
    this.totalPrice.forEach((price: number, index: number) => {
      sumPrice += price;
    });
    if (sumPrice === 0) {
      return null;
    }
    return sumPrice;
  }
  /*** END TOTAL PRICE */

  private async signedInvoiceAction(invoiceId: number) {
    let params: Array<any>;
    // get sign paramater
    await this.invoiceService.sign(invoiceId).subscribe(data => {
      params = data as Array<any>;
    });

    // const alias: string = params[0] + '';
    // const pdf64: string = params[1] + '';
    // const signatureImg: string = params[2] + '';
    // const location: string = '';
    // const ahdsign: string = '';

    // let signEncode: string;
    // await this.apiService.signByToken(alias, pdf64, signatureImg, location, ahdsign).subscribe(data => {
    //   signEncode = data as string;
    // });

    // this.apiService.signed(invoiceId, signEncode).subscribe(data => {

    // });
  }

  private loadGoods() {
    if (this.goodArr && this.goodArr.length > 0) {
      return;
    }

    this.goodService.getList().subscribe(items => {
      const goods = items as GoodData[];
      this.goodArr = new Array<GoodData>();

      for (let i = 0; i < goods.length; i++) {
        const good = new GoodData();
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

    this.customerService.getList().subscribe(items => {
      const customers = items as CustomerData[];
      this.customerArr = new Array<CustomerData>();

      for (let i = 0; i < customers.length; i++) {
        const customer = new CustomerData();
        Object.assign(customer, customers[i]);
        customer.select_item = customer.customer_code;
        this.customerArr.push(customer);
      }
    });
  }

  private loadReferences() {
    this.referenceService.referenceInfo().subscribe(items => {
      const selectItems = items as SelectData[];
      this.references = selectItems;

      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectData();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.comboTaxRate.push(selectItem);
        }

        if (selectItem.type === 'COMBO_FORM') {
          selectItem.select_item = selectItem.value;
          this.comboForm.push(selectItem);
        }
      }
    });
  }

  private initDataForm(customer: CustomerData) {
    if (customer) {
      this.addForm.patchValue({
        customerEmail: customer.email,
        customerOrg: customer.org,
        customerTax: customer.tax_code,
        customerCode: customer.customer_code,
        customerName: customer.customer_name,
        customerBankAccount: customer.bank_account,
        customerBank: customer.bank,
        customerAddress: customer.address
      });
    } else {
      this.addForm.patchValue({
        customerEmail: '',
        customerName: '',
        customerCode: '',
        customerTax: '',
        customerOrg: '',
        customerBankAccount: '',
        customerBank: '',
        customerAddress: ''
      });
    }
  }

  private initRouter() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.invoiceId = params.id;
      }
    });
  }

  private sumPriceArr(prices: Array<number>) {
    if (prices && prices.length > 0) {
      let sumPrice = 0;
      prices.forEach((price: number, index: number) => {
        sumPrice += price;
      });
      return sumPrice;
    }
    return 0;
  }

  private stickyButtonAdd() {
    const emptyProductLine: ProductData = {
      item_line: null,
      item_code: '',
      item_name: '',
      unit: '',
      quantity: null,
      price: null,
      ck: null,
      total_ck: null,
      tax_rate: null
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
    const items = new Array<SelectData>();
    let selectItem = new SelectData();

    // CK/TM,CK,TM mặc định CK/TM
    selectItem.code = 'CK/TM';
    selectItem.value = 'CK/TM';
    items.push(selectItem);

    selectItem = new SelectData();
    selectItem.code = 'CK';
    selectItem.value = 'CK';
    items.push(selectItem);

    selectItem = new SelectData();
    selectItem.code = 'CK/TM';
    selectItem.value = 'CK/TM';
    items.push(selectItem);
    return items;
  }

  private createItemsForm() {
    this.addForm = this.formBuilder.group({
      invoiceDate: ['', Validators.compose([Validators.required])],
      invoiceNo: '',
      form: ['', Validators.compose([Validators.required])],
      serial: ['', Validators.compose([Validators.required])],
      customerCode: ['', Validators.compose([Validators.required])],
      customerName: ['', Validators.compose([Validators.required])],
      customerTax: ['', Validators.compose([Validators.required])],
      customerEmail: ['', Validators.compose([Validators.required, Validators.email])],
      orderNo: ['', Validators.compose([Validators.required])],
      customerOrg: ['', Validators.compose([Validators.required])],
      paymentType: ['', Validators.compose([Validators.required])],
      customerBankAccount: '',
      customerBank: '',
      status: '',
      customerAddress: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      items: this.formBuilder.array([])
    });
  }

  private clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  private formSetDefault() {
    this.addForm.patchValue({
      invoiceDate: new Date()
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
        if (vat === null) {
          vat = 0;
        }
      }

      if (totalCk === null || totalCk === 0) {
        totalCk = controlArray.controls[idx].get('total_ck').value;
        if (totalCk === null) {
          totalCk = 0;
        }
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
      this.finalTotalPrice[idx] = totalPrice + totalVat - totalCkVal;
    }
  }
}
