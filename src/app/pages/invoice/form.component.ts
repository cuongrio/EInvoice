import { CB, DATE, MSG, ROUTE, STATUS, STORE_KEY, MODAL, ID, COOKIE_KEY, CONTENT_TYPE, STATE } from 'app/constant';
import * as moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import {
  CustomerData, GoodData, InvoiceModel, ProductData, SelectData, SignData, TokenData,
  ViewNameData,
  InvoiceRequest,
  AdjData
} from '@model/index';
import { NgSelectConfig } from '@ng-select/ng-select';
import {
  CustomerService, GoodService, InvoiceService, ModalService, ReferenceService,
  TokenService, UtilsService, CookieService
} from '@service/index';

import { InvoiceAbstract } from './invoice.abstract';
import { ConfirmDocComponent } from './modal/index';
import { Location } from '@angular/common';
import { TOKEN_TYPE } from './../../constant';

declare var $: any;

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent extends InvoiceAbstract
  implements OnInit, OnDestroy {

  curInvoice: InvoiceRequest = {};

  statusConst = STATUS;
  routeConst = ROUTE;

  curSegment: string;

  adjustForm: string;
  adjustSerial: string;
  isAdjust = false;
  isReplace = false;
  curAdjust: AdjData;
  viewNameData: ViewNameData;
  keptForUpdate: ViewNameData;

  // signed 
  invoiceDatePicked: string;

  isPreview = false;
  viewMode = false;

  // button status
  disabledEdit = true;
  disabledInCD = true;
  disabledAdd = false;
  disabledSign = true;
  disabledCopy = false;
  disabledExit = false;
  disabledPrintTranform = true;
  disabledAdjust = true;
  disabledReplace = true;
  disabledDisposed = false;
  disabledApproved = true;
  disabledDownload = true;

  canPreview = true;

  addForm: FormGroup;
  submitted = false;

  isChangeInvoice = false;

  viewCustomerCode = false;

  previewLoading = false;

  isEditing = false;

  modalRef: BsModalRef;

  bsConfig = DATE.bsConfig;

  references: Array<SelectData>;
  noItemLine = false;
  hiddenExColumn = true;

  // amount
  amountBeforeTaxArray = new Array<number>();
  amountArray = new Array<number>();

  taxArray = new Array<number>();
  discountArray = new Array<number>();

  // price no tax
  priceArray = new Array<number>();
  taxModel = new Array<string>();

  pickingCustomerCode = false;
  pickingCustomerTax = false;

  // combobox
  taxRateArr: Array<SelectData>;
  customerArr: Array<CustomerData>;
  goodArr: Array<GoodData>;

  cusCodePicked: string;
  cusTaxPicked: string;

  private subscription: Subscription;

  constructor(
    protected config: NgSelectConfig,
    protected ref: ChangeDetectorRef,
    protected spinnerService: NgxSpinnerService,
    protected localeService: BsLocaleService,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected modalService: ModalService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected bsmodalService: BsModalService,
    protected utilsService: UtilsService,
    protected goodService: GoodService,
    protected customerService: CustomerService,
    protected referenceService: ReferenceService,
    protected tokenService: TokenService,
    protected location: Location,
    protected cookieService: CookieService
  ) {
    super(
      ref,
      config,
      localeService,
      modalService,
      invoiceService,
      tokenService,
      spinnerService,
      utilsService,
      referenceService,
      cookieService
    );
  }

  ngOnInit() {
    this.createForm();
    this.initNewRow();
    this.loadReferences();
    this.initRouter();
    this.loadCustomers();
    this.loadGoods();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.referCallback$) {
      this.referCallback$.unsubscribe();
    }
    if (this.disposeCallback$) {
      this.disposeCallback$.unsubscribe()
    }
    if (this.approveCallback$) {
      this.approveCallback$.unsubscribe();
    }
    if (this.signCallback$) {
      this.signCallback$.unsubscribe();
    }
  }

  copyClicked() {
    if (this.curSegment === ROUTE.detail
      && this.curInvoice.id) {
      this.router.navigate([
        `/${ROUTE.invoice}/${ROUTE.copy}/${this.curInvoice.id}`
      ]);
    }
  }

  signClicked() {
    this.signBtnDisabled = true;
    const type = this.cookieService.get(COOKIE_KEY.signatureType);
    if (type === TOKEN_TYPE.soft) {
      this.invoiceService.signSoft(this.curInvoice.id)
        .subscribe(data => {
          this.showAlertSuccess(
            MSG.signSuccess,
            data.invoice_no
          );
          this.refresh(this.curInvoice.id);
        }, err => {
          this.alertError(err)
        });

    } else {
      this.sign(this.curInvoice);
      this.signCallback$.subscribe(() => {
        this.refresh(this.curInvoice.id);
      });
    }
  }

  disposeClicked() {
    this.dispose(this.curInvoice);
    this.disposeCallback$.subscribe(() => {
      this.refresh(this.curInvoice.id);
    });
  }

  redirectToAdjust() {
    this.router.navigate([
      `/${ROUTE.invoice}/${ROUTE.detail}/${this.curInvoice.id}/${ROUTE.adjust}`
    ]);
  }

  redirectToReplace() {
    this.router.navigate([
      `/${ROUTE.invoice}/${ROUTE.detail}/${this.curInvoice.id}/${ROUTE.replace}`
    ]);
  }

  editClicked() {
    this.viewMode = false;
    this.disabledAdd = true;
    this.disabledEdit = true;
    this.isEditing = true;
    this.disabledExit = true;
    this.disabledSign = true;

    // check for CustomerCode
    let iscomplete = this.existCustomerCodeComplete();
    if (!iscomplete) {
      const comboInput = $(ID.cusCode).find(ID.combobox);
      if (comboInput) {
        comboInput.val(this.cusCodePicked);
      }
    }
    iscomplete = this.existCustomerTaxComplete();
    if (!iscomplete) {
      const comboInput = $(ID.taxCode).find(ID.combobox);
      if (comboInput) {
        comboInput.val(this.cusTaxPicked);
      }
    }
    this.ref.markForCheck();
  }

  approveClicked() {
    this.approve(this.curInvoice);

    this.approveCallback$.subscribe(() => {
      this.refresh(this.curInvoice.id);
    });
  }

  downloadClicked() {
    this.downloadInv(this.curInvoice);
  }

  printClicked() {
    this.print(this.curInvoice.id);
  }

  invoiceDateValueChange(event: any) {
    const dateFormate = moment(event).format(DATE.vi);
    this.invoiceDatePicked = dateFormate;
  }

  ignoreClicked() {
    this.disabledExit = false;
    if (this.curSegment === ROUTE.detail) {
      this.refresh(this.curInvoice.id);
    } else {
      this.router.navigate(['/hoa-don']);
    }
  }

  initAdjust() {
    this.curAdjust = null;
    this.isAdjust = true;
    this.isReplace = false;
    this.initForAdjustAndReplace();
    this.ref.markForCheck();
  }

  initReplace() {
    this.curAdjust = null;
    this.isReplace = true;
    this.isAdjust = false;
    this.initForAdjustAndReplace();
    this.ref.markForCheck();
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/hoa-don']);
  }

  onSubmit(dataForm: any) {
    this.submitted = true;

    if (this.isPreview) {
      this.previewLoading = true;
    }
    let dataFormItems: any;
    this.noItemLine = true;

    if (dataForm.items && dataForm.items.length > 0) {
      dataFormItems = dataForm.items.filter((elemnent: any) => !!elemnent.item_name);

      this.noItemLine = true;
      if (dataFormItems && dataFormItems.length > 0) {
        this.noItemLine = false;
      }
    }

    if (this.addForm.invalid || this.noItemLine) {
      this.previewLoading = false;
      this.ref.markForCheck();
      return;
    }

    this.disabledExit = false;
    this.disabledSign = false;

    const model = this.toModelPopulator(
      dataForm,
      dataFormItems
    );

    if (this.isPreview) {
      this.submitForPreview(model);
      return;
    }

    if (this.curInvoice.id) {
      if (this.isAdjust) {
        const modalOtpRef = this.modalService.open(ConfirmDocComponent, {
          windowClass: MODAL.w_md,
          centered: true
        });

        modalOtpRef.result.then(
          (data) => {
            model.note_id = data.note_id;
            model.note_date = this.toYYYYMMDD(data.note_date);

            modalOtpRef.close();
            this.submitForAdjust(model);
          },
          () => {
            modalOtpRef.close();
          }
        );
        return;
      }

      if (this.isReplace) {
        const modalOtpRef = this.modalService.open(ConfirmDocComponent, {
          windowClass: MODAL.w_md,
          centered: true
        });

        modalOtpRef.result.then(
          (data) => {
            model.note_id = data.note_id;
            model.note_date = this.toYYYYMMDD(data.note_date);

            modalOtpRef.close();
            this.submitForReplace(model);
          },
          () => {
            modalOtpRef.close();
          }
        );

        return;
      }

      if (this.curSegment === ROUTE.copy) {
        this.submitForCreate(model);
        return;
      }

      // case update
      model.invoice_id = this.curInvoice.id;
      model.invoice_no = this.curInvoice.no;
      model.form = this.keptForUpdate.form;
      model.serial = this.keptForUpdate.serial;

      this.submitForUpdate(model);
    } else {
      this.submitForCreate(model);
    }
  }

  createClicked() {
    if (this.curSegment !== ROUTE.create) {
      if (this.isRouterRefresh()) {
        this.router.navigate([`/${ROUTE.invoice}/${ROUTE.create}`]);
      } else {
        this.router.navigate([`/${ROUTE.invoice}/${ROUTE.create}/${ROUTE.refresh}`]);
      }
    } else {
      this.resetForm();
      this.submitted = false;
      this.viewMode = false;
    }
  }

  updateTaxCode(val: string) {
    if (val && val.length > 0) {
      this.addForm.patchValue({
        tax_code: val
      });
    }
  }

  updateCustomerCode(val: string) {
    if (val && val.length > 0) {
      this.addForm.patchValue({
        customer_code: val
      });
    }
  }

  customer_codeFocus(event: any) {
    if (this.cusCodePicked) {
      event.target.value = this.cusCodePicked;
    }
  }

  tax_codeFocus(event: any) {
    if (this.cusTaxPicked) {
      event.target.value = this.cusTaxPicked;
    }
  }

  hideCustomerCodeInput() {
    $(ID.cusCode).find(ID.combobox).val('');
  }

  hideCustomerTaxInput() {
    $(ID.taxCode).find(ID.combobox).val('');
  }

  /***** BUTTON CLICKED */
  hiddenColumnClicked() {
    this.hiddenExColumn = !this.hiddenExColumn;
  }

  printTransfClicked() {
    this.printTransform(this.curInvoice.id);
  }

  /*** CUSTOMER CHANGE */
  onCustomerCodeChange(customer: any) {
    this.initDataForm(customer);
    const comboCodeInput = $(ID.cusCode).find(ID.combobox);
    if (comboCodeInput) {
      comboCodeInput.val('');
    }
    this.ref.markForCheck();
  }

  onCustomerTaxChange(customer: any) {
    this.initDataForm(customer);
    const comboTaxInput = $(ID.taxCode).find(ID.combobox);
    if (comboTaxInput) {
      comboTaxInput.val('');
    }
    this.ref.markForCheck();
  }

  onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.addForm.patchValue({
        serial: ''
      });
      const json = this.getKey(STORE_KEY.serialCb);

      if (json) {
        try {
          const items = JSON.parse(json) as SelectData[];
          if (items && items.length > 0) {
            this.comboSerial = this.clean(items);
            return;
          }
        } catch{ }

      }
      return;
    }
    this.loadSerialByForm(selectData.value);
  }

  onSerialChange(serialValue: any) {
    const selectData = new SelectData();
    Object.assign(selectData, serialValue[0]);
    this.addForm.patchValue({
      serial: selectData.code
    });
  }

  /**** GOOD CHANGE */
  onGoodlineChange(good: GoodData, idx: number) {
    this.submitted = false;
    const controlArray = this.itemFormArray;
    controlArray.controls[idx].get('item_line').setValue(idx + 1);
    controlArray.controls[idx].get('item_code').setValue(good.goods_code);
    controlArray.controls[idx].get('item_name').setValue(good.goods_name);
    controlArray.controls[idx].get('unit').setValue(good.unit);
    controlArray.controls[idx].get('price').setValue(good.price);

    // copy to model
    this.priceArray[idx] = good.price;
    this.noItemLine = false;
  }

  get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  deleteLineClicked(idx: number) {
    this.itemFormArray.removeAt(idx);
    // remove sum
    this.amountBeforeTaxArray.splice(idx, 1);
    this.amountArray.splice(idx, 1);
    this.taxArray.splice(idx, 1);
    this.priceArray.splice(idx, 1);
    this.discountArray.splice(idx, 1);
    this.taxModel.splice(idx, 1);
  }

  initNewRow() {
    const fg = this.formBuilder.group({
      item_line: '',
      item_code: '',
      unit: '',
      tax_rate_code: '',
      discount_rate: '',
      discount: '',
      item_name: ['', Validators.required],
      price: ['', Validators.required],
      tax_rate: ['', Validators.required],
      quantity: ['', Validators.required]
    });

    fg.patchValue({
      discount_rate: 0
    });

    this.itemFormArray.push(fg);

    // init first value
    this.amountBeforeTaxArray.push(0);
    this.taxArray.push(0);
    this.amountArray.push(0);
    this.priceArray.push(0);
    this.discountArray.push(0);
    this.taxModel.push('10');
  }

  get paymentMethodName() {
    if (this.viewNameData
      && this.viewNameData.payment_method) {
      return this.utilsService
        .getPaymentMethodName(
          this.viewNameData.payment_method,
          this.comboHTTT);
    }
    return '';
  }

  get statusName() {
    if (this.viewNameData
      && this.viewNameData.status) {
      return this.utilsService
        .getStatusName(
          this.viewNameData.status,
          this.comboStatus);
    }
    return '';
  }

  /*** TOTAL PRICE */
  // tinh lai amount, amountwt
  quantityValueChange(quantityStr: string, idx: number) {
    const quantity = parseInt(quantityStr, 0);
    const control = this.itemFormArray.controls[idx];

    const price = control.get('price').value;
    const taxRate = +this.taxModel[idx];

    this.recaculator(idx, taxRate, price, quantity);
  }

  // tinh lai tax, amount, priceWt
  priceValueChange(price: number, idx: number) {
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const taxRate = +this.taxModel[idx];
    this.priceArray[idx] = price;
    this.recaculator(idx, taxRate, price, quantity);
  }

  // total vat -> tinh lai tax
  taxRateValueChange(taxChoice: SelectData, idx: number) {
    let taxRate = 0;
    if (taxChoice) {
      taxRate = +taxChoice.value;
    }
    this.priceTaxPopulator(idx, taxRate);
    this.amountPopulator(idx);
  }

  // cho
  discountRateValueChange(
    discountRateStr: string,
    idx: number
  ) {
    const discountRate = parseInt(discountRateStr, 0);
    const taxRate = +this.taxModel[idx];
    this.discountArray[idx] = (this.amountBeforeTaxArray[idx] * discountRate) / 100;

    this.priceTaxPopulator(idx, taxRate);
    this.amountPopulator(idx);
  }

  // sum tong
  totalAmountBeforeTax(): number {
    return this.sumColumn(this.amountBeforeTaxArray);
  }

  totalTax(): number {
    return this.sumColumn(this.taxArray);
  }

  totalAmount(): number {
    return this.sumColumn(this.amountArray);
  }

  totalDiscount(): number {
    return this.sumColumn(this.discountArray);
  }

  totalPrice(): number {
    return this.sumColumn(this.priceArray);
  }

  formatCurrency(price: number) {
    if (price > 0) {
      return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    return price;
  }

  // SUBMIT ACTION CASE
  private toModelPopulator(
    dataForm: any,
    dataFormItems: any
  ): InvoiceModel {
    const model = new InvoiceModel();

    // general
    model.form = dataForm.form;
    model.serial = dataForm.serial;

    model.invoice_no = dataForm.invoice_no;
    model.order_no = dataForm.orderNo;
    const invoiceDate = moment(this.invoiceDatePicked, DATE.vi);
    const dateFormate = invoiceDate.format(DATE.en);
    model.invoice_date = dateFormate;

    // update customer
    model.customer = new CustomerData();
    model.customer.customer_name = dataForm.customer_name;
    model.customer.org = dataForm.org;
    model.customer.bank = dataForm.bank;
    model.customer.bank_account = dataForm.bank_account;
    model.customer.address = dataForm.address;
    model.customer.email = dataForm.email;
    model.customer.tax_code = dataForm.tax_code;
    model.customer.customer_code = dataForm.customer_code;
    model.customer.phone = dataForm.phone;
    model.payment_method = dataForm.payment_method;

    // total row
    model.total_before_tax = this.totalAmountBeforeTax();
    model.total = this.totalAmount();
    model.total_tax = this.totalTax();

    // set items
    model.items = dataFormItems;
    model.items.forEach((
      item: ProductData,
      indx: number) => {
      item.item_line = indx + 1;
      item.tax_rate_code = this.getVatCode(item.tax_rate + '');
      item.discount = item.discount > 0 ? item.discount : 0;
      item.discount_rate = item.discount_rate > 0 ? item.discount_rate : 0;

      item.tax = +this.taxArray[indx];
      item.amount_before_tax = +this.amountBeforeTaxArray[indx];
      item.amount = +this.amountArray[indx];

      // keep old
      item.price = this.priceArray[indx];
    });
    return model;
  }

  private submitForPreview(model: InvoiceModel) {
    this.invoiceService
      .preview(model)
      .subscribe((data: any) => {
        const file = new Blob([data], { type: CONTENT_TYPE.html });
        const fileURL = URL.createObjectURL(file);
        this.previewLoading = false;
        this.ref.markForCheck();
        window.open(fileURL);
      }, (err: any) => {
        this.previewLoading = false;
        this.ref.markForCheck();
        this.alertError(err);
      });
  }

  private submitForAdjust(model: InvoiceModel) {
    return this.invoiceService
      .ajustInvoice(this.curInvoice.id, model)
      .subscribe((data: any) => {
        this.showAlertSuccess(
          `${MSG.adjustSuccess} #${this.curInvoice.no}!`,
          data.invoice_no
        );

        this.refresh(data.invoice_id);
        return true;
      }, (err: any) => {

        this.showAlertError(
          MSG.adjustErr
        );

        this.submitted = false;
      });
  }

  private submitForReplace(model: InvoiceModel) {
    this.invoiceService
      .replaceInvoice(this.curInvoice.id, model)
      .subscribe((data: any) => {
        this.showAlertSuccess(
          `${MSG.replaceSuccess} #${this.curInvoice.no}!`,
          data.invoice_no
        );

        this.refresh(data.invoice_id);
        return true;
      }, (err: any) => {

        let msg = MSG.adjustErr;
        if (err.error) {
          msg = err.error.message;
        }
        this.showAlertError(
          MSG.adjustErr
        );

        this.submitted = false;
      });
  }

  private submitForUpdate(model: InvoiceModel) {
    this.invoiceService.updateInvoice(model)
      .subscribe((data: any) => {
        this.showAlertSuccess(
          MSG.updateSuccess,
          data.invoice_no
        );

        this.refresh(data.invoice_id);
      }, (err: any) => {

        let msg = MSG.updateErr;
        if (err.error) {
          msg = err.error.message;
        }
        this.showAlertError(
          msg
        );

        this.submitted = false;
      });
  }

  private submitForCreate(model: InvoiceModel) {
    delete model.invoice_id;
    delete model.invoice_no;
    delete model.status;

    this.invoiceService
      .createInvoice(model)
      .subscribe((data: any) => {
        this.showAlertSuccess(
          MSG.createSuccess,
          data.invoice_no
        );

        this.curInvoice = {
          id: data.invoice_id,
          no: data.invoice_no,
          status: data.status
        };

        this.viewMode = true;
        this.canPreview = false;
        this.location.replaceState(`/${ROUTE.invoice}/${ROUTE.detail}/${data.invoice_id}`);
        this.curSegment = ROUTE.detail;
        this.initBtnView();
        this.ref.markForCheck();
      }, (err: any) => {
        let msg = MSG.createErr;
        if (err.error) {
          msg = err.error.message;
        }
        this.showAlertError(msg);
        this.submitted = false;
      });
  }

  private refresh(invoiceId: number) {
    if (this.isRouterRefresh()) {
      this.router.navigate([`/${ROUTE.invoice}/${ROUTE.detail}/${invoiceId}`]);
    } else {
      this.router.navigate([`/${ROUTE.invoice}/${ROUTE.detail}/${invoiceId}/${ROUTE.refresh}`]);
    }
  }

  private isRouterRefresh(): boolean {
    const urlSegmentArr: UrlSegment[] = this.activatedRoute.snapshot.url;
    let segmentMerged: string;
    urlSegmentArr.forEach((item: UrlSegment) => {
      segmentMerged += item.path;
    });

    console.log('segmentMerged', segmentMerged);
    if (segmentMerged.indexOf(ROUTE.refresh) === -1) {
      return false;
    }
    return true;
  }

  private resetForm() {
    this.amountBeforeTaxArray = new Array<number>();
    this.amountArray = new Array<number>();
    this.taxArray = new Array<number>();
    this.noItemLine = false;

    this.clearFormArray(this.itemFormArray);
    this.addForm.reset();
    this.initNewRow();
    const dateFormate = moment(new Date()).format(DATE.vi);
    this.invoiceDatePicked = dateFormate;
    this.addForm.patchValue({
      invoiceDate: dateFormate
    });

    this.checkCbFormLoaded();
  }

  private checkCbFormLoaded(): boolean{
    if (this.isNotEmpty(this.comboForm)
      && this.isNotEmpty(this.comboSerial)
      && this.isNotEmpty(this.comboHTTT)
      && this.isNotEmpty(this.comboTaxRate)
      && this.isNotEmpty(this.comboStatus)) {
      const firstForm = this.comboForm[0].code;
      this.loadSerialByForm(firstForm);
      this.addForm.patchValue({
        form: firstForm,
        payment_method: this.comboHTTT[0].code
      });
      return true;
    }

    return false;
  }

  private loadSerialByForm(form: string) {
    const serialArr = new Array<SelectData>();
    if (form && form.length > 0) {
      const type = `${CB.serial}${form}`;
      const json = this.getKey(STORE_KEY.serialCb);

      if (json) {
        const serialCb = JSON.parse(json);
        serialCb.forEach((item: SelectData) => {
          if (item.type === type) {
            serialArr.push(item);
          }
        });
      }
      this.comboSerial = this.clean(serialArr);

      if (this.comboSerial.length > 0) {
        this.addForm.patchValue({
          serial: this.comboSerial[0].value
        });
      }
    }
  }

  private recaculator(
    idx: number,
    taxRate: number,
    price: number,
    quantity: number) {
    this.amountBeforeTaxPopulator(idx, price, quantity);
    this.priceTaxPopulator(idx, taxRate);
    this.amountPopulator(idx);
  }

  private sumColumn(columns: Array<number>) {
    let sumPrice = 0;
    columns.forEach((price: number) => {
      sumPrice += price;
    });
    if (sumPrice === 0) {
      return null;
    }
    return sumPrice;
  }
  /*** END TOTAL PRICE */
  private loadGoods() {
    if (this.goodArr && this.goodArr.length > 0) {
      return;
    }

    const data = this.getKey(STORE_KEY.gAutoCp);
    if (data) {
      this.goodArr = JSON.parse(data) as GoodData[];
      if (this.goodArr && this.goodArr.length > 0) {
        return;
      }
    }

    this.goodService.queryGoods()
      .subscribe((data: any) => {
        if (data.contents) {
          this.goodArr = data.contents as GoodData[];
          this.putKey(STORE_KEY.gAutoCp, this.goodArr);
        }
      }, (err: any) => {

        this.alertError(err);
      });
  }

  private loadCustomers() {
    if (this.customerArr
      && this.customerArr.length > 0) {
      return;
    }

    const json = this.getKey(STORE_KEY.cusAutoCp);
    if (json) {
      this.customerArr = JSON.parse(json) as CustomerData[];
      if (this.customerArr && this.customerArr.length > 0) {
        return;
      }
    }

    this.customerService.queryCustomers()
      .subscribe((data: any) => {
        if (data.contents) {
          this.customerArr = data.contents as CustomerData[];

          this.putKey(
            STORE_KEY.cusAutoCp,
            this.customerArr
          );
        }
      });
  }

  private loadReferences() {

    // check in session 
    this.loadComboFromStorage();

    const cbLoaded = this.checkCbFormLoaded();
    if(cbLoaded){
      return;
    }

    this.loadcomboFromRest();
    this.referCallback$.subscribe(() => {
      // set default value
      if (this.comboForm && this.comboForm.length > 0) {
        const formPicked = this.comboForm[0].code;
        this.addForm.patchValue({
          form: formPicked
        });
        this.loadSerialByForm(formPicked);
      }

      if (this.comboHTTT && this.comboHTTT.length > 0) {
        this.addForm.patchValue({
          payment_method: this.comboHTTT[0].code
        });
      }
      this.ref.markForCheck();
    });
  }

  private initDataForm(customer: CustomerData) {
    if (customer && customer.customer_id) {
      this.addForm.patchValue({
        email: customer.email,
        org: customer.org,
        tax_code: customer.tax_code,
        customer_code: customer.customer_code,
        customer_name: customer.customer_name,
        bank_account: customer.bank_account,
        bank: customer.bank,
        address: customer.address,
        customerPhone: customer.phone
      });
    }
  }

  private getVatCode(value: string): string {
    for (let i = 0; i < this.comboTaxRate.length; i++) {
      if (this.comboTaxRate[i].value === value) {
        return this.comboTaxRate[i].code;
      }
    }
  }

  private getCurrSegment(
    segments: Array<string>
  ): string {
    if (segments.includes(ROUTE.adjust)) {
      return ROUTE.adjust;
    }

    if (segments.includes(ROUTE.replace)) {
      return ROUTE.replace;
    }

    if (segments.includes(ROUTE.copy)) {
      return ROUTE.copy;
    }

    if (segments.includes(ROUTE.create)) {
      return ROUTE.create;
    }

    if (segments.includes(ROUTE.detail)) {
      return ROUTE.detail;
    }
    this.router.navigate(['/trang-404']);
  }

  private initRouter() {
    const segments: Array<string> =
      this.activatedRoute.snapshot.url.map(seg => seg.path);
    this.curSegment = this.getCurrSegment(segments);
    if (!this.curSegment) {
      return;
    }

    this.canPreview = true;
    this.keptForUpdate = {};

    if (this.curSegment === ROUTE.create) {
      this.initBtnCreate();
      return;
    }

    // case create new
    return this.subscription =
      this.activatedRoute.params
        .subscribe((params: any) => {
          let invoice_id = params.id;
          if (invoice_id) {
            invoice_id = invoice_id.replace(/[^\d]/g, '');
            this.curInvoice.id = +invoice_id;

            if (this.curSegment === ROUTE.detail) {
              this.initBtnView();
            }

            this.canPreview = false;
            return this.invoiceService
              .retrieveInvoiceById(this.curInvoice.id)
              .subscribe((data: any) => {
                this.setFormWithDefaultData(
                  data
                );

                if (this.curSegment === ROUTE.adjust) {
                  this.isChangeInvoice = true;
                  this.initAdjust();
                  const dateFormate = moment(
                    new Date()).format(DATE.vi);
                  this.invoiceDatePicked = dateFormate;
                  this.addForm.patchValue({
                    invoiceDate: dateFormate,
                    form: data.form,
                    serial: data.serial,
                    payment_method: data.payment_method
                  });

                  this.buttonStateForAdjust();
                }

                if (this.curSegment === ROUTE.replace) {
                  this.isChangeInvoice = true;
                  this.initReplace();
                  this.buttonStateForChange();
                }

                this.ref.markForCheck();
              }, (err: any) => {
                this.alertError(err);
              });
          }
        });
  }

  private setFormWithDefaultData(
    data: any
  ) {

    this.taxArray = new Array<number>();
    this.amountBeforeTaxArray = new Array<number>();
    this.amountArray = new Array<number>();
    this.taxModel = new Array<string>();

    // global variables
    this.cusCodePicked = data.customer.customer_code;
    this.cusTaxPicked = data.customer.tax_code;

    this.adjustForm = data.form;
    this.adjustSerial = data.serial;
    this.curInvoice = {
      id: data.invoice_id,
      no: data.invoice_no,
      status: data.status
    };

    // load serialcombobox
    this.loadSerialByForm(data.form);

    this.addForm.patchValue({
      serial: data.serial,
      form: data.form,
      customer_code: data.customer.customer_code,
      tax_code: data.customer.tax_code,
      email: data.customer.email,
      customer_name: data.customer.customer_name,
      org: data.customer.org,
      bank_account: data.customer.bank_account,
      bank: data.customer.bank,
      address: data.customer.address,
      payment_method: data.payment_method
    });

    if (this.curSegment === ROUTE.detail) {
      const invoiceDate =
        moment(data.invoice_date).format(DATE.vi);

      this.invoiceDatePicked = invoiceDate;
      this.addForm.patchValue({
        invoiceDate: invoiceDate,
        invoice_no: data.invoice_no,
        status: data.status
      });

      // kept data
      this.keptForUpdate = {
        form: data.form,
        serial: data.serial
      };

      // set button state
      this.buttonStateByState(data.invoice_state);
      this.buttonStateByStatus(data.status);

      // set view name
      // view name
      this.viewNameData = {
        status: data.status,
        payment_method: data.payment_method
      };

      // get data for adjust
      if (data.ref_invoice_id) {
        const refs = this.getOriginRefs(
          data.ref_invoice_id,
          data.ref_invoice_form,
          data.ref_invoice_serial,
          data.ref_invoice_no,
          data.ref_invoice_date
        );

        this.curAdjust = {
          invoice_type: data.invoice_type,
          refs,
          secure_id: data.secure_id
        };

        this.buttonStateByType(data.invoice_type);
      }
    }

    if (this.curSegment === ROUTE.copy) {
      this.disabledCopy = true;

      const currentDate =
        moment(new Date()).format(DATE.vi);
      this.invoiceDatePicked = currentDate;
      this.addForm.patchValue({
        invoiceDate: currentDate
      });
    }

    const controlArray = this.itemFormArray;
    if (data.items && data.items.length > 0) {
      data.items.forEach((item: any, idx: number) => {
        if (!controlArray.controls[idx]) {
          this.initNewRow();
        }

        controlArray.controls[idx].get('item_line').setValue(item.item_line);
        controlArray.controls[idx].get('item_code').setValue(item.item_code);
        controlArray.controls[idx].get('item_name').setValue(item.item_name);
        controlArray.controls[idx].get('unit').setValue(item.unit);
        controlArray.controls[idx].get('price').setValue(item.price_before_tax);
        controlArray.controls[idx].get('quantity').setValue(item.quantity);
        controlArray.controls[idx].get('discount_rate').setValue(item.discount_rate);
        controlArray.controls[idx].get('discount').setValue(0);

        if (this.curSegment !== ROUTE.copy) {
          controlArray.controls[idx].get('tax_rate').setValue(item.tax_rate);
        }

        this.taxArray.splice(idx, 0, item.tax);
        this.amountBeforeTaxArray.splice(idx, 0, item.amount_before_tax);
        this.amountArray.splice(idx, 0, item.amount);
        this.taxModel[idx] = item.tax_rate + '';
        this.discountArray[idx] = (this.amountBeforeTaxArray[idx] * item.discount_rate) / 100;
      });
    }
  }

  private getOriginRefs(
    id: string,
    form: string,
    serial: string,
    no: string,
    date: string
  ): Array<any> {
    const refList = new Array<any>();

    const refIds = id ? id.split(',') : [];
    const forms = form ? form.split(',') : [];
    const serials = serial ? serial.split(',') : [];
    const nso = no ? no.split(',') : [];
    const dates = date ? date.split(',') : [];

    if (refIds.length > 0) {
      refIds.forEach((id, index) => {
        if (id) {
          refList.push({
            id: id,
            form: forms.length > 0 && forms[index]
              ? forms[index]
              : '',
            serial: serials.length > 0 && serials[index]
              ? serials[index]
              : '',
            no: nso.length > 0 && nso[index]
              ? nso[index]
              : '',
            date: dates.length > 0 && dates[index]
              ? dates[index]
              : ''
          });
        }
      });
    }

    return refList;
  }

  private existCustomerCodeComplete(): boolean {
    this.customerArr.forEach((item: CustomerData, index: number, arr: any) => {
      if (item.customer_code === this.cusCodePicked) {
        return true;
      }
    });
    return false;
  }

  private existCustomerTaxComplete(): boolean {
    this.customerArr.forEach((item: CustomerData, index: number, arr: any) => {
      if (item.tax_code === this.cusTaxPicked) {
        return true;
      }
    });
    return false;
  }

  private createForm() {
    this.addForm = this.formBuilder.group({
      invoiceDate: [
        '',
        Validators.compose([Validators.required])
      ],
      invoice_no: '',
      orderNo: '',
      form: [
        '',
        Validators.compose([Validators.required])
      ],
      serial: [
        '',
        Validators.compose([Validators.required])
      ],
      customer_code: '',
      customer_name: '',
      tax_code: '',
      email: [
        '',
        Validators.compose([Validators.email])
      ],
      customerPhone: '',
      org: '',
      payment_method: [
        '',
        Validators.compose([Validators.required])
      ],
      bank_account: '',
      bank: '',
      status: '',
      address: [
        '',
        Validators.compose([Validators.required])
      ],
      items: this.formBuilder.array([])
    }, {
      validator: (formControl: FormControl) => {
        const org = formControl.get('org').value;
        const customer_name = formControl.get('customer_name').value;
        if (!customer_name && !org) {
          return { invalidOrgName: true };
        }
        if (customer_name && customer_name.length === 0
          && org && org.length === 0) {
          return { invalidOrgName: true };
        }
        return null;
      }
    });

    const dateFormate = moment(new Date()).format(DATE.vi);
    this.invoiceDatePicked = dateFormate;
    this.addForm.patchValue({
      invoiceDate: dateFormate
    });
  }

  private clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private initForAdjustAndReplace() {
    const dateFormate = moment(
      new Date()
    ).format(DATE.vi);

    this.invoiceDatePicked = dateFormate;
    this.addForm.patchValue({
      invoiceDate: dateFormate
    });
    this.clearFormArray(this.itemFormArray);
    this.initNewRow();
    this.amountBeforeTaxArray = new Array<number>();
    this.amountArray = new Array<number>();
    this.taxArray = new Array<number>();
    this.discountArray = new Array<number>();
    this.priceArray = new Array<number>();
    this.viewMode = false;
    this.disabledEdit = true;
    this.disabledSign = true;
    this.disabledAdd = true;
  }


  /**************
   * FUNCTION CACULATOR
   */

  // Tiền chưa thuế
  private amountBeforeTaxPopulator(
    idx: number,
    price: number,
    quantity: number
  ) {
    price = price > 0 ? price : 0;
    quantity = quantity > 0 ? quantity : 0;
    const amount = price * quantity;
    this.amountBeforeTaxArray[idx] = amount;
  }

  // Thành Tiền
  private amountPopulator(idx: number) {
    const discount = this.discountArray[idx] > 0 ? this.discountArray[idx] : 0;
    const amount = (this.amountBeforeTaxArray[idx] - discount) + this.taxArray[idx];
    this.amountArray[idx] = amount;
  }

  // Tiền thuế
  private priceTaxPopulator(idx: number, taxRate: number) {
    taxRate = taxRate > 0 ? taxRate : 0;
    const discount = this.discountArray[idx] > 0 ? this.discountArray[idx] : 0;
    const tax = ((this.amountBeforeTaxArray[idx] - discount) * taxRate) / 100;
    this.taxArray[idx] = Math.round(tax);
  }

  /////////////////////////////
  //BUTTON STATUS//////////////
  /////////////////////////////

  private initBtnCreate() {
    this.disabledDisposed = true;
    this.disabledCopy = true;
    this.disabledAdjust = true;
    this.disabledApproved = true;
    this.disabledEdit = true;
    this.disabledInCD = true;
    this.disabledPrintTranform = true;
    this.disabledReplace = true;
    this.disabledDownload;
  }

  private initBtnView() {
    this.disabledAdd = false;
    this.disabledAdjust = false;
    this.disabledEdit = false;
    this.viewMode = true;
    this.disabledReplace = false;
    this.disabledCopy = false;
  }

  private buttonStateByType(type: string) {
    if (type === STATUS.replace
      || type === STATUS.replaced) {
      this.disabledReplace = true;
    }
    if (type === STATUS.adj
      || type === STATUS.adjed) {
      this.disabledAdjust = true;
    }
  }
  private buttonStateByState(state: string) {
    this.disabledDownload = true;

    if (state === STATE.signed
      || state === STATE.approve) {
      this.disabledDownload = false;
    }
  }

  private buttonStateByStatus(status: string) {
    if (status === STATUS.created) {
      this.disabledSign = false;
      this.disabledAdjust = true;
      this.disabledReplace = true;
    }
    if (status === STATUS.signed) {
      this.disabledSign = true;
      this.disabledAdjust = false;
      this.disabledReplace = false;
      this.disabledApproved = false;
    }
    if (status === STATUS.approve
      || status === STATUS.signed) {
      this.disabledInCD = false;
      this.disabledAdjust = false;
      this.disabledReplace = false;
      this.disabledEdit = true;
    }
    if (status === STATUS.disposed) {
      this.disabledEdit = true;
      this.disabledAdjust = true;
      this.disabledReplace = true;
      this.disabledPrintTranform = true;
      this.disabledDisposed = true;
      this.disabledCopy = true;
    }
  }

  private buttonStateForAdjust() {
    this.disabledCopy = true;
    this.disabledDisposed = true;
    this.disabledApproved = true;
    this.disabledPrintTranform = true;
  }

  private buttonStateForChange() {
    this.disabledCopy = true;
    this.disabledDisposed = true;
    this.disabledApproved = true;
    this.disabledPrintTranform = true;
  }


}
