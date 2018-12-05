import { Component, OnInit, OnDestroy, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { UtilsService } from '@app/_services/utils/utils.service';
import { InvoiceService } from './../../../_services/app/invoice.service';
import { CustomerData } from './../../../_models/data/customer.data';
import { SelectData, GoodData, InvoiceModel, ProductData, ProductModel, TokenData } from '@app/_models';
import { CustomerService } from './../../../_services/app/customer.service';
import { GoodService, TokenService } from '@app/_services';
import { ReferenceService } from './../../../_services/app/reference.service';
import { Location } from '@angular/common';

declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  public invoiceId: number;
  public form: string;
  public serial: string;
  public adjust = false;

  // signed
  public tokenPicked: TokenData;
  public listTokenAvaiable: Array<TokenData>;

  public signErrorMessage: string;
  public signButtonDisabled = true;
  public signButtonLoading = false;

  public isPreview = false;
  public viewMode = false;
  // button status
  public disabledEdit = true;
  public disabledInCD = true;
  public disabledAdd = false;
  public disabledSign = true;
  public disabledPrintTranform = true;
  public disabledAdjust = true;

  public addForm: FormGroup;
  public submitted = false;

  public viewCustomerCode = false;

  public modalRef: BsModalRef;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };

  public formPicked: any;
  public serialPicked: any;
  public customerPicked: any;
  public htttPicked: Array<SelectData>;
  public references: Array<SelectData>;
  public noItemLine = false;
  public hiddenExColumn = true;

  // amount
  public totalAmount = new Array<number>();
  public totalPriceTax = new Array<number>();
  public totalPriceWt = new Array<number>();
  public priceOrigin = new Array<number>();
  public totalAmoutWt = new Array<number>();
  public totalQuantityTax = new Array<number>();

  public configSingleBox = {
    noResultsFound: ' ',
    showNotFound: true,
    placeholder: ' ',
    toggleDropdown: true,
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

  public pickingCustomerCode = false;
  public pickingCustomerTax = false;

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
    private location: Location,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  editClicked() {
    this.viewMode = false;
    this.ref.markForCheck();
  }
  backClicked() {
    this.location.back();
  }

  adjustClicked() {
    this.clearFormArray(this.itemFormArray);
    this.stickyButtonAdd();
    this.totalAmount = new Array<number>();
    this.totalAmoutWt = new Array<number>();
    this.totalPriceTax = new Array<number>();
    this.totalQuantityTax = new Array<number>();
    this.priceOrigin = new Array<number>();
    this.adjust = true;
    this.viewMode = false;
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  public loadTokenData() {
    if (this.listTokenAvaiable && this.listTokenAvaiable.length > 0) {
      return true;
    }
    this.tokenService.listToken().subscribe((dataArr: Array<TokenData>) => {
      if (dataArr && dataArr.length > 0) {
        this.listTokenAvaiable = dataArr;
        dataArr.forEach((item: TokenData, idx: number) => {
          item.select_item = item.name + '\n' + item.effectiveDate;
        });
      }
      this.ref.markForCheck();
    }, err => {
      if (err.error) {
        this.signErrorMessage = err.error.message;
      } else {
        this.signErrorMessage = 'Đã có lỗi xảy ra!';
      }
    });
  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    let dataFormItems: any;
    this.noItemLine = true;
    console.log('isPreview: ' + this.isPreview);

    if (dataForm.items && dataForm.items.length > 0) {
      dataFormItems = dataForm.items.filter((elemnent: any, index: number, array: any) => {
        return elemnent.item_name && elemnent.item_name.length > 0;
      });

      if (dataFormItems && dataFormItems.length > 0) {
        this.noItemLine = false;
      } else {
        this.noItemLine = true;
      }
    }

    this.ref.markForCheck();
    if (this.addForm.invalid || this.noItemLine) {
      return;
    }
    const invoiceModel = new InvoiceModel();
    // general
    invoiceModel.form = dataForm.form;
    invoiceModel.serial = dataForm.serial;
    const dateFormate = moment(dataForm.invoiceDate).format('YYYY-MM-DD');
    invoiceModel.invoice_date = dateFormate;

    // update customer
    invoiceModel.customer = new CustomerData();
    invoiceModel.customer.customer_name = dataForm.customerName;
    invoiceModel.customer.org = dataForm.customerOrg;
    invoiceModel.customer.bank = dataForm.customerBank;
    invoiceModel.customer.bank_account = dataForm.customerBankAccount;
    invoiceModel.customer.address = dataForm.customerAddress;
    invoiceModel.customer.email = dataForm.customerEmail;
    invoiceModel.customer.tax_code = dataForm.customerTax;
    invoiceModel.customer.phone = this.customerPicked[0].phone;

    // paymentType
    invoiceModel.paymentType = dataForm.paymentType;

    invoiceModel.total_before_tax = this.sumTotalAmount();
    invoiceModel.total_tax = this.sumTotalQuantityTax();
    invoiceModel.total = this.sumTotalAmountWt();

    // set items
    invoiceModel.items = dataFormItems;
    invoiceModel.items.forEach((item: ProductData, indx: number) => {
      item.tax_rate_code = this.getVatCode(item.tax_rate + '');
      console.log(item.tax_rate_code);
      item.tax = +this.totalPriceTax[indx];
      item.price_wt = +this.totalPriceWt[indx];
      item.amount = +this.totalAmount[indx];
      item.amount_wt = +this.totalAmoutWt[indx];
    });

    if (this.isPreview) {
      console.log('isPreview');
      this.invoiceService.preview(invoiceModel).subscribe(data => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL);
        window.open(fileURL);
      });
    } else {
      console.log('tao hoa don');
      return this.invoiceService.createInvoice(invoiceModel).subscribe(
        data => {
          const initialState = {
            message: 'Đã tạo hóa đơn thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Hóa đơn #${data.invoice_id}`
          };
          this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });

          this.addForm.patchValue({
            invoiceNo: data.invoice_no,
            status: data.status
          });
          this.viewMode = true;
          this.disabledEdit = false;
          this.disabledSign = false;
          this.ref.markForCheck();
          this.submitted = false;
        },
        err => {
          const initialState = {
            message: 'Không thể tạo hóa đơn!',
            title: 'Đã có lỗi!',
            class: 'error'
          };

          if (err.error) {
            initialState.message = err.error.message;
          }
          this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
          this.submitted = false;
        }
      );
    }
  }

  public openModalMd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-token' });
  }

  public addNewButtonClicked() {
    this.resetForm();
    this.submitted = false;
  }

  public onTokenChange(selectItems: Array<TokenData>) {
    this.tokenPicked = new TokenData();
    this.signButtonDisabled = true;
    if (selectItems.length > 0 && selectItems[0]) {
      Object.assign(this.tokenPicked, selectItems[0]);
      this.signButtonDisabled = false;
    }
  }

  public async tokenChoiceClicked() {
    if (!this.invoiceId) {
      return;
    }
    this.signButtonDisabled = true;
    this.signButtonLoading = true;
    localStorage.setItem('token-picked', JSON.stringify(this.tokenPicked));
    const dataToken = await this.invoiceService.sign(this.invoiceId)
      .toPromise().catch(err => {
        if (err.error) {
          this.signErrorMessage = err.error.message;
        } else {
          this.signErrorMessage = 'Đã có lỗi xảy ra!';
        }
      });

    const signToken = await this.invoiceService.signByToken(
      this.tokenPicked.alias,
      dataToken.pdf_base64,
      dataToken.signature_img_base64,
      dataToken.location,
      dataToken.ahd_sign_base64
    ).toPromise().catch(err => {
      if (err.error) {
        this.signErrorMessage = err.error.message;
      } else {
        this.signErrorMessage = 'Đã có lỗi xảy ra!';
      }
    });

    this.invoiceService.signed(this.invoiceId, JSON.stringify(signToken)).subscribe(data => {
      this.modalRef.hide();
      this.signButtonDisabled = false;
      this.signButtonLoading = false;
      const initialState = {
        message: 'Đã ký thành công hóa đơn!',
        title: 'Thông báo!',
        class: 'success',
        highlight: `Hóa đơn #${this.invoiceId}`
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    }, err => {
      this.signButtonDisabled = false;
      this.signButtonLoading = false;
      if (err.error) {
        this.signErrorMessage = err.error.message;
      } else {
        this.signErrorMessage = 'Đã có lỗi xảy ra!';
      }
    });
  }

  /***** BUTTON CLICKED */
  public hiddenColumnClicked() {
    this.hiddenExColumn = !this.hiddenExColumn;
  }

  public inCDClicked() {
    this.invoiceService.printTransform(this.invoiceId).subscribe(data => { });
  }

  /*** CUSTOMER CHANGE */
  public onCustomerTaxChange(customerValue: any) {
    const customer = new CustomerData();
    Object.assign(customer, customerValue[0]);
    this.addForm.patchValue({
      customerTax: customer.tax_code
    });

    this.initDataForm(customer);
  }

  public onCustomerCodeChange(customerValue: any) {
    const customer = new CustomerData();
    Object.assign(customer, customerValue[0]);
    this.addForm.patchValue({
      customerCode: customer.customer_code
    });

    this.initDataForm(customer);
    this.ref.markForCheck();
  }

  public onHtttChange(htttValue: any) {
    const item = new SelectData();
    Object.assign(item, htttValue[0]);
    this.addForm.patchValue({
      paymentType: item.code
    });
    this.ref.markForCheck();
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

  /**** GOOD CHANGE */
  public onGoodlineChange(dataArr: GoodData[], idx: number) {
    if (dataArr && dataArr.length > 0) {
      const good = dataArr[0];
      const controlArray = this.itemFormArray;
      controlArray.controls[idx].get('item_line').setValue(idx + 1);
      controlArray.controls[idx].get('item_code').setValue(good.goods_code);
      controlArray.controls[idx].get('item_name').setValue(good.goods_name);
      controlArray.controls[idx].get('unit').setValue(good.unit);
      controlArray.controls[idx].get('price').setValue(good.price);
      controlArray.controls[idx].get('tax_rate').setValue(good.tax_rate);

      this.noItemLine = false;
      this.priceOrigin[idx] = good.price;
      this.priceTaxPopulator(idx, good.price, good.tax_rate);
      this.priceWtPopulator(idx, good.price);
    }
  }

  public get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  public deleteLineClicked(idx: number) {
    this.itemFormArray.removeAt(idx);
    // remove sum
    this.totalAmount.splice(idx, 1);
    this.totalAmoutWt.splice(idx, 1);
    this.totalPriceTax.splice(idx, 1);
    this.totalPriceWt.splice(idx, 1);
    this.totalQuantityTax.splice(idx, 1);
    this.priceOrigin.splice(idx, 1);
  }

  public addMoreLineClicked() {
    this.stickyButtonAdd();
  }

  /*** TOTAL PRICE */
  // tinh lai amount, amountwt
  public quantityValueChange(quantity: number, idx: number) {
    const price = this.itemFormArray.controls[idx].get('price').value;
    const ck = this.itemFormArray.controls[idx].get('ck').value;
    this.recaculator(idx, ck, price, quantity);
  }

  // tinh lai tax, amount, priceWt
  public priceValueChange(price: number, idx: number) {
    const ck = this.itemFormArray.controls[idx].get('ck').value;
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const taxRate = this.itemFormArray.controls[idx].get('tax_rate').value;

    this.priceTaxPopulator(idx, price, taxRate);
    this.priceWtPopulator(idx, price);
    this.recaculator(idx, ck, price, quantity);
  }

  // total vat -> tinh lai tax
  public taxRateValueChange(taxRate: number, idx: number) {
    const price = this.itemFormArray.controls[idx].get('price').value;
    const ck = this.itemFormArray.controls[idx].get('ck').value;
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const taxRateCode = this.getVatCode(taxRate + '');
    // set tax rate
    this.itemFormArray.controls[idx].get('tax_rate_code').setValue(taxRateCode);

    this.priceTaxPopulator(idx, price, taxRate);
    this.priceWtPopulator(idx, price);
    this.recaculator(idx, ck, price, quantity);
  }

  // cho
  public ckValueChange(ck: number, idx: number) {
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const price = this.itemFormArray.controls[idx].get('price').value;
    this.totalCKPopulator(idx, ck, price, quantity);

    // reload all
    this.recaculator(idx, ck, price, quantity);
  }

  // cho
  public totalCkValueChange(totalCk: number, idx: number) {
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const price = this.itemFormArray.controls[idx].get('price').value;
    const ck = this.itemFormArray.controls[idx].get('ck').value;
    this.recaculator(idx, ck, price, quantity);
  }

  public loadSerialBox() {
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  public loadFormBox() {
    console.log(JSON.stringify(this.comboForm));
    if (this.comboForm && this.comboForm.length > 0) {
      console.log('return' + this.comboForm[0].code);
      return;
    }
    if (!this.references) {
      this.loadReferences();
    }
  }

  sumTotalPriceTax(): number {
    return this.sumColumn(this.totalPriceTax);
  }

  sumTotalQuantityTax(): number {
    return this.sumColumn(this.totalQuantityTax);
  }

  sumTotalAmountWt(): number {
    return this.sumColumn(this.totalAmoutWt);
  }

  sumTotalAmount(): number {
    return this.sumColumn(this.totalAmount);
  }

  private resetForm() {
    this.customerPicked = null;
    this.totalAmount = new Array<number>();
    this.totalAmoutWt = new Array<number>();
    this.totalPriceTax = new Array<number>();
    this.totalQuantityTax = new Array<number>();
    this.priceOrigin = new Array<number>();
    this.noItemLine = false;

    this.clearFormArray(this.itemFormArray);
    this.addForm.reset();

    // set default
    this.formSetDefault();
    this.loadCustomers();
    this.loadGoods();
    this.stickyButtonAdd();
  }

  private getVatCode(value: string): string {
    for (let i = 0; i < this.comboTaxRate.length; i++) {
      if (this.comboTaxRate[i].value === value) {
        return this.comboTaxRate[i].code;
      }
    }
  }

  private recaculator(idx: number, ck: number, price: number, quantity: number) {
    // reload all
    this.amountPopulator(idx, price, quantity);
    this.amountWtPopulator(idx, quantity);
    this.totalCKPopulator(idx, ck, price, quantity);
    this.totalQuantityTaxPopulator(idx, quantity);
  }

  private sumColumn(columns: Array<number>) {
    let sumPrice = 0;
    columns.forEach((price: number, index: number) => {
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

    this.goodService.getList().subscribe((items: GoodData[]) => {
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
    this.htttPicked = new Array<SelectData>();
    this.htttPicked.push(this.comboHTTT[0]);
    console.log(this.htttPicked);
    this.addForm.patchValue({
      paymentType: this.htttPicked[0].code
    });
  }

  private loadCustomers() {
    if (this.customerArr && this.customerArr.length > 0) {
      return;
    }

    this.customerService.getList().subscribe((items: CustomerData[]) => {
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
    this.referenceService.referenceInfo().subscribe((items: SelectData[]) => {
      const selectItems = items as SelectData[];
      this.references = selectItems;
      this.comboForm = new Array<SelectData>();
      this.comboTaxRate = new Array<SelectData>();

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
        this.disabledAdjust = false;
        this.disabledEdit = false;
        this.viewMode = true;

        this.invoiceService.retrieveInvoiceById(this.invoiceId).subscribe(data => {
          this.setFormWithDefaultData(data);
          this.form = data.form;
          this.serial = data.serial;

          if (data.status === 'CREATED') {
            this.disabledSign = false;
          }
          if (data.status === 'APPROVED' || data.status === 'SIGNED') {
            this.disabledInCD = false;
          }
        });
      }
    });
  }

  private setFormWithDefaultData(data: any) {
    this.totalPriceTax = new Array<number>();
    this.totalQuantityTax = new Array<number>();
    this.totalAmount = new Array<number>();
    this.totalAmoutWt = new Array<number>();

    const invoiceDate = moment(data.invoice_date).format('DD-MM-YYYY');

    this.addForm.patchValue({
      invoiceDate: invoiceDate,
      invoiceNo: data.invoice_no,
      customerTax: data.customer.tax_code,
      customerEmail: data.customer.email,
      customerName: data.customer.customer_name,
      customerOrg: data.customer.org,
      customerBankAccount: data.customer.bank_account,
      customerBank: data.customer.bank,
      customerAddress: data.customer.address,
      form: data.form,
      serial: data.serial,
      status: data.status
    });

    const controlArray = this.itemFormArray;
    data.items.forEach((item: any, idx: number) => {
      controlArray.controls[idx].get('item_line').setValue(idx + 1);
      controlArray.controls[idx].get('item_code').setValue(item.item_code);

      controlArray.controls[idx].get('item_name').setValue(item.item_name);
      controlArray.controls[idx].get('unit').setValue(item.unit);
      controlArray.controls[idx].get('price').setValue(item.price);
      controlArray.controls[idx].get('tax_rate').setValue(item.tax_rate);
      controlArray.controls[idx].get('quantity').setValue(item.quantity);
      controlArray.controls[idx].get('ck').setValue(0);
      controlArray.controls[idx].get('total_ck').setValue(0);

      this.totalPriceTax.splice(idx, 0, item.tax);
      this.totalPriceWt.splice(idx, 0, item.price_wt);
      this.totalAmount.splice(idx, 0, item.amount);
      this.totalAmoutWt.splice(idx, 0, item.amount_wt);
      this.totalQuantityTax.splice(idx, 0, item.tax * item.quantity);
    });

    console.log(JSON.stringify(data.items));
  }

  private stickyButtonAdd() {
    const emptyProductLine: ProductData = {
      item_line: null,
      item_code: '',
      item_name: '',
      unit: '',
      price: null,
      tax_rate: null,
      tax_rate_code: '',
      quantity: null,
      ck: null,
      total_ck: null
    };

    const fg = this.formBuilder.group(emptyProductLine);
    this.itemFormArray.push(fg);

    // init first value
    this.totalAmount.push(null);
    this.totalPriceWt.push(null);
    this.totalPriceTax.push(null);
    this.totalQuantityTax.push(null);
    this.totalAmoutWt.push(null);
    this.priceOrigin.push(null);
  }

  // https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example

  private htttDummy() {
    const items = new Array<SelectData>();
    let selectItem = new SelectData();

    // CK/TM,CK,TM mặc định CK/TM
    selectItem.code = 'CK/TM';
    selectItem.select_item = 'CK/TM';
    items.push(selectItem);

    selectItem = new SelectData();
    selectItem.code = 'CK';
    selectItem.select_item = 'CK';
    items.push(selectItem);

    selectItem = new SelectData();
    selectItem.code = 'CK/TM';
    selectItem.select_item = 'CK/TM';
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
      orderNo: '',
      customerOrg: ['', Validators.compose([Validators.required])],
      paymentType: ['', Validators.compose([Validators.required])],
      customerBankAccount: '',
      customerBank: '',
      status: '',
      customerAddress: ['', Validators.compose([Validators.required])],
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
      invoiceDate: new Date()
    });
  }

  /**************
   * FUNCTION CACULATOR
   */
  private amountPopulator(idx: number, price: number, quantity: number) {
    price = price > 0 ? price : 0;
    quantity = quantity > 0 ? quantity : 0;
    const amount = price * quantity;
    this.totalAmount[idx] = amount;
  }
  private amountWtPopulator(idx: number, quantity: number) {
    quantity = quantity > 0 ? quantity : 0;
    const priceWt = this.totalPriceWt[idx] > 0 ? this.totalPriceWt[idx] : 0;
    const amountWt = priceWt * quantity;

    this.totalAmoutWt[idx] = amountWt;
  }

  private priceTaxPopulator(idx: number, price: number, taxRate: number) {
    price = price > 0 ? price : 0;
    taxRate = taxRate > 0 ? taxRate : 0;
    const tax = (price * taxRate) / 100;
    this.totalPriceTax[idx] = tax;
  }

  private totalQuantityTaxPopulator(idx: number, quantity: number) {
    quantity = quantity > 0 ? quantity : 0;
    const tax = this.totalPriceTax[idx] > 0 ? this.totalPriceTax[idx] : 0;
    this.totalQuantityTax[idx] = quantity * tax;
  }

  private priceWtPopulator(idx: number, price: number) {
    price = price > 0 ? price : 0;
    const tax = this.totalPriceTax[idx] > 0 ? this.totalPriceTax[idx] : 0;
    this.totalPriceWt[idx] = price + tax;
  }

  private totalCKPopulator(idx: number, ckPercentage: number, price: number, quantity: number) {
    price = price > 0 ? price : 0;
    quantity = quantity > 0 ? quantity : 0;
    ckPercentage = ckPercentage > 0 ? ckPercentage : 0;

    const totalCk = (price * quantity * ckPercentage) / 100;
    this.itemFormArray.controls[idx].get('total_ck').setValue(totalCk);

    if (ckPercentage > 0) {
      const newPrice = price - totalCk;
      this.itemFormArray.controls[idx].get('price').setValue(newPrice);
    } else {
      this.itemFormArray.controls[idx].get('price').setValue(this.priceOrigin[idx]);
    }
  }

  private pricePopulator(idx: number, oldPrice: number, ck: number, totalCK: number) {
    if (oldPrice > 0 && ck > 0 && totalCK > 0) {
      totalCK = totalCK > 0 ? totalCK : 0;
      const newPrice = oldPrice - totalCK;
      this.itemFormArray.controls[idx].get('price').setValue(newPrice);
    } else {
      this.itemFormArray.controls[idx].get('price').setValue(this.priceOrigin[idx]);
    }
  }
}
