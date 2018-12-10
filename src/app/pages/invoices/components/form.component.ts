import {
  Component, OnInit, OnDestroy, TemplateRef,
  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment, NavigationEnd } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { UtilsService } from '@app/_services/utils/utils.service';
import { InvoiceService } from './../../../_services/app/invoice.service';
import { CustomerData } from './../../../_models/data/customer.data';
import { SelectData, GoodData, InvoiceModel, ProductData, TokenData, ViewNameData } from '@app/_models';
import { CustomerService } from './../../../_services/app/customer.service';
import { GoodService, TokenService } from '@app/_services';
import { ReferenceService } from './../../../_services/app/reference.service';
import { Location } from '@angular/common';

import * as moment from 'moment';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ISpinnerConfig, SPINNER_PLACEMENT, SPINNER_ANIMATIONS } from '@hardpool/ngx-spinner';
import { AdjustData } from './../../../_models/data/adjust.data';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  public invoiceId: number;
  public invoiceNo: string;
  public segmentRouter: string;
  public adjustForm: string;
  public adjustSerial: string;
  public isAdjust = false;
  public isReplace = false;
  public currentAdjust: AdjustData;
  public viewNameData: ViewNameData;

  // signed
  public tokenPicked: TokenData;
  public invoiceDatePicked: string;
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
  public disabledReplace = true;
  public canPreview = true;

  public addForm: FormGroup;
  public submitted = false;

  public viewCustomerCode = false;

  public previewLoading = false;
  public formLoading = false;
  public serialLoading = false;
  public htttLoading = false;
  public taxRateLoading = false;
  public customerLoading = false;
  public goodLoading = false;
  public signTokenLoading = false;

  public modalRef: BsModalRef;

  public bsConfig = {
    dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue'
  };

  public formPicked: string;
  public serialPicked: string;
  public htttModel: string;

  public references: Array<SelectData>;
  public noItemLine = false;
  public hiddenExColumn = true;

  // amount
  public lineAmount = new Array<number>();
  public linePriceTax = new Array<number>();
  public lineAmoutWt = new Array<number>();
  public lineDiscount = new Array<number>();
  public linePriceOrigin = new Array<number>();
  public linePriceWt = new Array<number>();
  public taxModel = new Array<string>();

  public spinnerConfig: ISpinnerConfig;

  public pickingCustomerCode = false;
  public pickingCustomerTax = false;

  // combobox
  public taxRateArr: Array<SelectData>;
  public customerArr: Array<CustomerData>;
  public goodArr: Array<GoodData>;

  public comboStatus = new Array<SelectData>();
  public comboHTTT = new Array<SelectData>();
  public comboForm = new Array<SelectData>();
  public comboSerial = new Array<SelectData>();
  public comboTaxRate = new Array<SelectData>();
  public comboSerialStorage = new Array<SelectData>();

  private subscription: Subscription;

  constructor(
    private config: NgSelectConfig,
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
  ) {
    this.config.notFoundText = 'Không có kết quả';
    this.config.loadingText = 'Đang tải..';
    this.config.addTagText = 'Thêm';
  }

  ngOnInit() {
    this.createItemsForm();
    this.initNewRow();
    this.initSpinnerConfig();
    this.initRouter();
    this.loadReferences();
    this.loadCustomers();
    this.loadGoods();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public editClicked() {
    this.viewMode = false;
    this.ref.markForCheck();
  }

  public printRowClicked() {
    const invoiceId = +this.invoiceId;
    this.previewLoading = true;
    this.invoiceService.print(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.ref.markForCheck();
      window.open(fileURL);
      setTimeout(function () {
        this.signTokenLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      setTimeout(function () {
        this.signTokenLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
      this.ref.markForCheck();
      this.errorHandler(err);
    });
  }

  public invoiceDateValueChange(event: any) {
    const dateFormate = moment(event).format('DD-MM-YYYY');
    this.invoiceDatePicked = dateFormate;
  }

  public backClicked() {
    this.location.back();
  }

  public adjustClicked() {
    this.currentAdjust = null;
    this.isAdjust = true;
    this.isReplace = false;
    this.initForAdjustAndReplace();
    this.ref.markForCheck();
  }

  public replaceClicked() {
    this.currentAdjust = null;
    this.isReplace = true;
    this.isAdjust = false;
    this.initForAdjustAndReplace();
    this.ref.markForCheck();
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  public loadTokenData() {
    if (this.listTokenAvaiable && this.listTokenAvaiable.length > 0) {
      return true;
    }
    this.signTokenLoading = true;
    this.tokenService.listToken().subscribe((dataArr: Array<TokenData>) => {
      if (dataArr && dataArr.length > 0) {
        this.listTokenAvaiable = dataArr;
        this.ref.markForCheck();
      }
      setTimeout(function () {
        this.signTokenLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      setTimeout(function () {
        this.signTokenLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
      this.errorHandler(err);
    });
  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    if (this.isPreview) {
      this.previewLoading = true;
    }
    let dataFormItems: any;
    this.noItemLine = true;

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
      this.previewLoading = false;
      return;
    }
    const invoiceModel = new InvoiceModel();
    // general
    invoiceModel.form = dataForm.form;
    invoiceModel.serial = dataForm.serial;

    invoiceModel.invoice_no = dataForm.invoiceNo;
    invoiceModel.order_no = dataForm.orderNo;
    const invoiceDate = moment(this.invoiceDatePicked, 'DD-MM-YYYY');
    const dateFormate = invoiceDate.format('YYYY-MM-DD');
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
    invoiceModel.customer.customer_code = dataForm.customerCode;
    invoiceModel.customer.phone = dataForm.phone;

    // paymentType
    invoiceModel.paymentType = dataForm.paymentType;

    invoiceModel.total_before_tax = this.sumLineAmount();
    invoiceModel.total = this.sumLineAmountWt();
    invoiceModel.total_tax = this.sumLinePriceTax();

    // set items
    invoiceModel.items = dataFormItems;
    invoiceModel.items.forEach((item: ProductData, indx: number) => {
      item.item_line = indx + 1;
      item.tax_rate_code = this.getVatCode(item.tax_rate + '');
      item.discount = item.discount > 0 ? item.discount : 0;
      item.discount_rate = item.discount_rate > 0 ? item.discount_rate : 0;

      item.tax = +this.linePriceTax[indx];
      item.amount = +this.lineAmount[indx];
      item.amount_wt = +this.lineAmoutWt[indx];

      // keep old
      item.price_wt = this.linePriceWt[indx];
    });

    if (this.isPreview) {
      return this.submitForPreview(invoiceModel);
    } else {
      if (this.invoiceId) {
        if (this.isAdjust) {
          return this.submitForAdjust(invoiceModel);
        } else if (this.isReplace) {
          return this.submitForReplace(invoiceModel);
        } else {
          if (this.segmentRouter === 'copy') {
            return this.submitForCreate(invoiceModel);
          } else {
            // case update
            invoiceModel.invoice_id = this.invoiceId;
            invoiceModel.invoice_no = this.invoiceNo;
            return this.submitForUpdate(invoiceModel);
          }
        }
      } else {
        return this.submitForCreate(invoiceModel);
      }
    }
  }

  public openModalMd(template: TemplateRef<any>) {
    this.signErrorMessage = '';
    this.loadTokenData();
    this.modalRef = this.modalService.show(template, { class: 'modal-token' });
  }

  public addNewButtonClicked() {
    if (this.segmentRouter !== 'createNew') {
      this.router.navigate(['/invoices/createNew']);
    } else {
      this.resetForm();
      this.submitted = false;
      this.viewMode = false;
    }
  }

  public onTokenChange(token: any) {
    this.signErrorMessage = '';
    if (token) {
      this.signButtonDisabled = false;
      this.tokenPicked = token;
    }
  }

  public async tokenChoiceClicked() {
    this.signButtonDisabled = true;
    this.signButtonLoading = true;
    const invoiceId = +this.invoiceId;
    const invoiceNo = this.invoiceNo;
    const dataToken = await this.invoiceService.sign(invoiceId)
      .toPromise().catch(err => {
        this.errorSignHandler(err);
      });

    const signToken = await this.invoiceService.signByToken(
      this.tokenPicked.alias,
      dataToken.pdf_base64,
      dataToken.signature_img_base64,
      dataToken.location,
      dataToken.ahd_sign_base64
    ).toPromise().catch(err => {
      this.errorSignHandler(err);
    });

    if (signToken) {
      this.invoiceService.signed(invoiceId, signToken).subscribe((data: any) => {
        this.addForm.patchValue({
          status: 'SIGNED'
        });
        this.modalRef.hide();
        this.signButtonDisabled = false;
        this.signButtonLoading = false;
        const initialState = {
          message: 'Đã ký thành công hóa đơn!',
          title: 'Thông báo!',
          class: 'success',
          highlight: `Hóa đơn #${invoiceNo}`
        };

        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
        this.resolvedLink(invoiceId);
      }, err => {
        this.errorSignHandler(err);
      });
    }
  }

  /***** BUTTON CLICKED */
  public hiddenColumnClicked() {
    this.hiddenExColumn = !this.hiddenExColumn;
  }

  public printTransformRowClicked() {
    const invoiceId = +this.invoiceId;
    this.invoiceService.printTransform(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, err => {
      const initialState = {
        message: 'Hóa đơn chỉ được in chuyển đổi một lần!',
        title: 'Hóa đơn đã in chuyển đổi',
        class: 'error'
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    });
  }

  /*** CUSTOMER CHANGE */
  public onCustomerChange(customer: any) {
    console.log(customer);
    this.initDataForm(customer);
    this.ref.markForCheck();
  }

  public onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.serialPicked = null;
      this.addForm.patchValue({
        serial: ''
      });
      return;
    }
    this.comboSerial = new Array<SelectData>();
    this.loadSerialByForm(selectData.value);
  }

  public onSerialChange(serialValue: any) {
    const selectData = new SelectData();
    Object.assign(selectData, serialValue[0]);
    this.addForm.patchValue({
      serial: selectData.code
    });
  }

  /**** GOOD CHANGE */
  public onGoodlineChange(good: GoodData, idx: number) {
    this.submitted = false;
    const controlArray = this.itemFormArray;
    controlArray.controls[idx].get('item_line').setValue(idx + 1);
    controlArray.controls[idx].get('item_code').setValue(good.goods_code);
    controlArray.controls[idx].get('item_name').setValue(good.goods_name);
    controlArray.controls[idx].get('unit').setValue(good.unit);
    controlArray.controls[idx].get('price').setValue(good.price);

    // copy to model
    this.linePriceOrigin[idx] = good.price;
    this.noItemLine = false;
  }

  public get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  public deleteLineClicked(idx: number) {
    this.itemFormArray.removeAt(idx);
    // remove sum
    this.lineAmount.splice(idx, 1);
    this.lineAmoutWt.splice(idx, 1);
    this.linePriceTax.splice(idx, 1);
    this.linePriceOrigin.splice(idx, 1);
    this.lineDiscount.splice(idx, 1);
    this.taxModel.splice(idx, 1);
  }

  public initNewRow() {
    const fg = this.formBuilder.group({
      item_line: '',
      item_code: '',
      item_name: ['', Validators.required],
      unit: ['', Validators.required],
      price: ['', Validators.required],
      tax_rate: ['', Validators.required],
      tax_rate_code: '',
      quantity: ['', Validators.required],
      discount_rate: '',
      discount: ''
    });

    fg.patchValue({
      discount_rate: 0,
    });

    this.itemFormArray.push(fg);

    // init first value
    this.lineAmount.push(null);
    this.linePriceTax.push(null);
    this.lineAmoutWt.push(null);
    this.linePriceOrigin.push(0);
    this.lineDiscount.push(0);
    this.linePriceWt.push(0);
    this.taxModel.push('10');
  }

  public get paymentTypeName() {
    if (this.viewNameData && this.viewNameData.paymentType) {
      return this.utilsService.getPaymentTypeName(this.viewNameData.paymentType, this.comboHTTT);
    }
    return '';
  }

  public get statusName() {
    if (this.viewNameData && this.viewNameData.status) {
      return this.utilsService.getStatusName(this.viewNameData.status, this.comboStatus);
    }
    return '';
  }

  /*** TOTAL PRICE */
  // tinh lai amount, amountwt
  public quantityValueChange(quantityStr: string, idx: number) {
    const quantity = parseInt(quantityStr, 0);
    const price = this.itemFormArray.controls[idx].get('price').value;
    const taxRate = +this.taxModel[idx];

    this.recaculator(idx, taxRate, price, quantity);
  }

  // tinh lai tax, amount, priceWt
  public priceValueChange(price: number, idx: number) {
    const quantity = this.itemFormArray.controls[idx].get('quantity').value;
    const taxRate = +this.taxModel[idx];
    this.linePriceOrigin[idx] = price;
    this.linePriceWt[idx] = (price * (1 + taxRate)) / 100;
    this.recaculator(idx, taxRate, price, quantity);
  }

  // total vat -> tinh lai tax
  public taxRateValueChange(taxChoice: SelectData, idx: number) {
    let taxRate = 0;
    if (taxChoice) {
      taxRate = +taxChoice.value;
    }
    const price = this.linePriceOrigin[idx];
    this.linePriceWt[idx] = (price * (1 + taxRate)) / 100;
    this.priceTaxPopulator(idx, taxRate);
    this.amountWtPopulator(idx);
  }

  // cho
  public discountRateValueChange(discountRateStr: string, idx: number) {
    const discountRate = parseInt(discountRateStr, 0);
    const taxRate = +this.taxModel[idx];
    this.lineDiscount[idx] = (this.lineAmount[idx] * discountRate) / 100;

    this.priceTaxPopulator(idx, taxRate);
    this.amountWtPopulator(idx);
  }

  public loadFormBox() {
    this.formLoading = true;
    if (this.comboForm && this.comboForm.length > 0) {
      this.formPicked = this.comboForm[0].value;
      this.addForm.patchValue({
        form: this.formPicked
      });
      this.formLoading = false;
      return;
    }
    if (!this.references) {
      this.loadReferences();
    }
  }

  // sum tong
  public sumLineAmount(): number {
    return this.sumColumn(this.lineAmount);
  }
  public sumLinePriceTax(): number {
    return this.sumColumn(this.linePriceTax);
  }

  public sumLineAmountWt(): number {
    return this.sumColumn(this.lineAmoutWt);
  }

  public sumLineDiscount(): number {
    return this.sumColumn(this.lineDiscount);
  }

  public sumLinePrice(): number {
    return this.sumColumn(this.linePriceOrigin);
  }

  // SUBMIT ACTION CASE
  private submitForPreview(invoiceModel: InvoiceModel) {
    this.invoiceService.preview(invoiceModel).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.previewLoading = false;
      this.ref.markForCheck();
      window.open(fileURL);
    }, err => {
      this.previewLoading = false;
      this.ref.markForCheck();
      this.errorHandler(err);
    });
  }

  private submitForAdjust(invoiceModel: InvoiceModel) {
    return this.invoiceService.ajustInvoice(this.invoiceId, invoiceModel).subscribe(data => {
      const initialState = {
        message: `Đã điều chỉnh cho hóa đơn #${this.invoiceNo}!`,
        title: 'Thành công!',
        class: 'success',
        highlight: `Số hóa đơn mới: #${data.invoice_no}.`
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.resolvedLink(data.invoice_id);
      return true;
    }, err => {
      const initialState = {
        message: 'Không thể điều chỉnh hóa đơn!',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.submitted = false;
    });
  }

  private submitForReplace(invoiceModel: InvoiceModel) {
    this.invoiceService.replaceInvoice(this.invoiceId, invoiceModel).subscribe(data => {
      const initialState = {
        message: `Đã thay thế hóa đơn #${this.invoiceNo}!`,
        title: 'Thành công!',
        class: 'success',
        highlight: `Số hóa đơn mới: #${data.invoice_no}.`
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.resolvedLink(data.invoice_id);
      return true;
    }, err => {
      const initialState = {
        message: 'Không thể điều chỉnh hóa đơn!',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.submitted = false;
    });
  }

  private submitForUpdate(invoiceModel: InvoiceModel) {
    this.invoiceService.updateInvoice(invoiceModel).subscribe(data => {
      const initialState = {
        message: `Đã cập nhật hóa đơn thành công!`,
        title: 'Thành công!',
        class: 'success',
        highlight: `Hóa đơn: #${data.invoice_no}.`
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.resolvedLink(data.invoice_id);
    }, err => {
      const initialState = {
        message: 'Không thể cập nhật hóa đơn!',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      this.submitted = false;
    });
  }

  private submitForCreate(invoiceModel: InvoiceModel) {
    this.invoiceService.createInvoice(invoiceModel).subscribe(
      data => {
        const initialState = {
          message: 'Đã tạo hóa đơn thành công!',
          title: 'Thành công!',
          class: 'success',
          highlight: `Hóa đơn: #${data.invoice_no}.`
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
        this.resolvedLink(data.invoice_id);
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
      });
  }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Đã có lỗi xảy ra',
      title: 'Đã có lỗi!',
      class: 'error'
    };
    if (err.message) {
      initialState.message = err.error.message;
    } else {
      if (err.error) {
        initialState.message = err.error.message;
      }
    }

    this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
  }

  private resolvedLink(invoice_id: number) {
    if (this.isRouterRefresh()) {
      this.router.navigate([`/invoices/open/${invoice_id}`]);
    } else {
      this.router.navigate([`/invoices/open/${invoice_id}/refresh`]);
    }
  }

  private isRouterRefresh(): boolean {
    const urlSegmentArr: UrlSegment[] = this.activatedRoute.snapshot.url;
    let segmentMerged: string;
    urlSegmentArr.forEach((item: UrlSegment, idx: number) => {
      segmentMerged += item.path;
    });
    console.log(segmentMerged);
    if (segmentMerged.indexOf('refresh') === -1) {
      return false;
    }
    return true;
  }

  private resetForm() {
    this.lineAmount = new Array<number>();
    this.lineAmoutWt = new Array<number>();
    this.linePriceTax = new Array<number>();
    this.noItemLine = false;

    this.clearFormArray(this.itemFormArray);
    this.addForm.reset();

    // set default
    this.loadCustomers();
    this.loadGoods();
    this.initNewRow();

    const dateFormate = moment(new Date()).format('DD-MM-YYYY');
    this.invoiceDatePicked = dateFormate;
    this.addForm.patchValue({
      invoiceDate: dateFormate
    });
  }

  private errorSignHandler(err: any) {
    this.signButtonDisabled = false;
    this.signButtonLoading = false;
    if (err.error) {
      this.signErrorMessage = err.error.message;
    } else {
      this.signErrorMessage = 'Đã có lỗi xảy ra!';
    }
  }

  private loadSerialByForm(form: string) {
    this.serialLoading = true;
    if (form && form.length > 0) {
      const comboType = `COMBO_SERIAL_${form}`;

      this.references.forEach((item: SelectData, index: number) => {
        if (item.type === comboType) {
          this.comboSerial.push(item);
        }
      });
    }

    // set default picked
    if (this.comboSerial.length > 0) {
      this.serialPicked = this.comboSerial[0].value;
      this.addForm.patchValue({
        serial: this.serialPicked
      });
    }
    setTimeout(function () {
      this.serialLoading = false;
      this.ref.markForCheck();
    }.bind(this), 200);
  }

  private recaculator(idx: number, taxRate: number, price: number, quantity: number) {
    // reload all
    this.amountPopulator(idx, price, quantity);
    this.priceTaxPopulator(idx, taxRate);
    this.amountWtPopulator(idx);
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
  private loadGoods() {
    if (this.goodArr && this.goodArr.length > 0) {
      return;
    }
    // check in session
    const goodJson = sessionStorage.getItem('goodAutocomplete');
    if (goodJson) {
      this.goodArr = JSON.parse(goodJson) as GoodData[];
      if (this.goodArr && this.goodArr.length > 0) {
        return;
      }
    }

    this.goodLoading = true;
    this.goodService.getList().subscribe((items: GoodData[]) => {
      this.goodArr = items as GoodData[];
      sessionStorage.setItem('goodAutocomplete', JSON.stringify(this.goodArr));
      setTimeout(function () {
        this.goodLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);

    }, err => {
      setTimeout(function () {
        this.goodLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
      this.errorHandler(err);
    });
  }

  private loadCustomers() {
    if (this.customerArr && this.customerArr.length > 0) {
      return;
    }

    // check in session
    const customerJson = sessionStorage.getItem('customerAutocomplete');
    if (customerJson) {
      this.customerArr = JSON.parse(customerJson) as CustomerData[];
      if (this.customerArr && this.customerArr.length > 0) {
        return;
      }
    }

    this.customerLoading = true;
    this.customerService.getList().subscribe((items: CustomerData[]) => {
      this.customerArr = items as CustomerData[];
      sessionStorage.setItem('customerAutocomplete', JSON.stringify(this.customerArr));
      setTimeout(function () {
        this.customerLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    });
  }

  private loadReferences() {

    // loading
    this.formLoading = true;
    this.taxRateLoading = true;
    this.htttLoading = true;

    // reset object
    this.comboForm = new Array<SelectData>();
    this.comboTaxRate = new Array<SelectData>();
    this.comboTaxRate = new Array<SelectData>();
    this.comboHTTT = new Array<SelectData>();
    this.comboStatus = new Array<SelectData>();
    this.comboSerialStorage = new Array<SelectData>();

    sessionStorage.setItem('comboForm', '');
    sessionStorage.setItem('comboHTTT', '');
    sessionStorage.setItem('comboTaxRate', '');
    sessionStorage.setItem('comboStatus', '');
    sessionStorage.setItem('comboSerialStorage', '');
    this.referenceService.referenceInfo().subscribe((items: SelectData[]) => {
      const selectItems = items as SelectData[];
      this.references = selectItems;


      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectData();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.comboTaxRate.push(selectItem);
        }

        if (selectItem.type === 'COMBO_FORM') {
          this.comboForm.push(selectItem);
        }

        if (selectItem.type === 'COMBO_PAYMENT') {
          this.comboHTTT.push(selectItem);
        }
        if (selectItem.type === 'COMBO_INVOICE_STATUS') {
          this.comboStatus.push(selectItem);
        }
        if (selectItem.type.startsWith('COMBO_SERIAL_')) {
          // save to sesssion
          this.comboSerialStorage.push(selectItem);
        }
      }

      // set default value
      if (this.comboForm.length > 0) {
        this.formPicked = this.comboForm[0].value;
        this.addForm.patchValue({
          form: this.formPicked
        });
        this.loadSerialByForm(this.formPicked);
      }

      if (this.comboHTTT.length > 0) {
        this.htttModel = this.comboHTTT[0].code;
        this.addForm.patchValue({
          paymentType: this.htttModel
        });
      }
      // set to localstorage
      sessionStorage.setItem('comboForm', JSON.stringify(this.comboForm));
      sessionStorage.setItem('comboHTTT', JSON.stringify(this.comboHTTT));
      sessionStorage.setItem('comboTaxRate', JSON.stringify(this.comboTaxRate));
      sessionStorage.setItem('comboStatus', JSON.stringify(this.comboStatus));
      sessionStorage.setItem('comboSerialStorage', JSON.stringify(this.comboSerialStorage));

      setTimeout(function () {
        this.taxRateLoading = false;
        this.formLoading = false;
        this.htttLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      setTimeout(function () {
        this.taxRateLoading = false;
        this.formLoading = false;
        this.htttLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
      this.errorHandler(err);
    });
  }

  private initDataForm(customer: CustomerData) {
    if (customer && customer.customer_id) {
      this.addForm.patchValue({
        customerEmail: customer.email,
        customerOrg: customer.org,
        customerTax: customer.tax_code,
        customerCode: customer.customer_code,
        customerName: customer.customer_name,
        customerBankAccount: customer.bank_account,
        customerBank: customer.bank,
        customerAddress: customer.address,
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

  private initRouter() {
    const urlSegmentArr: UrlSegment[] = this.activatedRoute.snapshot.url;
    const segment = urlSegmentArr[0].path;
    this.segmentRouter = segment;
    this.canPreview = true;

    // case create new
    return this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.invoiceId = params.id;
        if (segment === 'open') {

          // button status
          this.disabledAdjust = false;
          this.disabledEdit = false;
          this.viewMode = true;
          this.disabledReplace = false;
        }

        this.canPreview = false;

        return this.invoiceService.retrieveInvoiceById(this.invoiceId).subscribe(data => {
          this.invoiceNo = data.invoice_no;
          if (segment === 'open') {
            this.setFormWithDefaultData(data, 'open');
            this.adjustForm = data.form;
            this.adjustSerial = data.serial;

            // set view name
            // view name
            this.viewNameData = {
              status: data.status,
              paymentType: data.paymentType
            };

            // get data for adjust
            if (data.ref_invoice_id) {
              this.currentAdjust = {
                invoice_type: data.invoice_type,
                ref_invoice_id: data.ref_invoice_id,
                ref_invoice_form: data.ref_invoice_form,
                ref_invoice_serial: data.ref_invoice_serial,
                ref_invoice_no: data.ref_invoice_no,
                ref_invoice_date: data.ref_invoice_date,
                secure_id: data.secure_id
              };
              this.disabledAdjust = true;
              this.disabledReplace = true;
            }

            if (data.status === 'CREATED') {
              this.disabledSign = false;
              this.disabledAdjust = true;
              this.disabledReplace = true;
            }
            if (data.status && data.status === 'SIGNED') {
              this.disabledSign = true;
              this.disabledEdit = true;
              this.disabledAdjust = false;
              this.disabledReplace = false;
            }
            if (data.status === 'APPROVED' || data.status === 'SIGNED') {
              this.disabledInCD = false;
            }
          }
          if (segment === 'copy') {
            this.setFormWithDefaultData(data, 'copy');
          }
          this.ref.markForCheck();
          return true;
        }, err => {
          this.errorHandler(err);
        });
      }
    });
  }

  private setFormWithDefaultData(data: any, usercase: string) {
    this.linePriceTax = new Array<number>();
    this.lineAmount = new Array<number>();
    this.lineAmoutWt = new Array<number>();
    this.taxModel = new Array<string>();

    // load serialcombobox
    this.loadSerialByForm(data.form);
    this.serialPicked = data.serial;
    this.formPicked = data.form;

    this.addForm.patchValue({
      customerCode: data.customer.customer_code,
      customerTax: data.customer.tax_code,
      customerEmail: data.customer.email,
      customerName: data.customer.customer_name,
      customerOrg: data.customer.org,
      customerBankAccount: data.customer.bank_account,
      customerBank: data.customer.bank,
      customerAddress: data.customer.address,
    });

    if (usercase === 'open') {
      const invoiceDate = moment(data.invoice_date).format('DD-MM-YYYY');
      this.invoiceDatePicked = invoiceDate;
      this.addForm.patchValue({
        invoiceDate: invoiceDate,
        invoiceNo: data.invoice_no,
        status: data.status
      });
    }
    if (usercase === 'copy') {
      const currentDate = moment(new Date()).format('DD-MM-YYYY');
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
        controlArray.controls[idx].get('price').setValue(item.price);
        controlArray.controls[idx].get('tax_rate').setValue(item.tax_rate);
        this.taxModel[idx] = item.tax_rate + '';
        controlArray.controls[idx].get('quantity').setValue(item.quantity);
        controlArray.controls[idx].get('discount_rate').setValue(item.discount_rate);
        controlArray.controls[idx].get('discount').setValue(0);

        this.linePriceTax.splice(idx, 0, item.tax);
        this.lineAmount.splice(idx, 0, item.amount);
        this.lineAmoutWt.splice(idx, 0, item.amount_wt);
        this.linePriceWt.splice(idx, 0, item.price_wt);
        this.lineDiscount[idx] = (this.lineAmount[idx] * item.discount_rate) / 100;
      });
    }
  }

  private createItemsForm() {
    this.addForm = this.formBuilder.group({
      invoiceDate: ['', Validators.compose([Validators.required])],
      invoiceNo: '',
      orderNo: '',
      form: ['', Validators.compose([Validators.required])],
      serial: ['', Validators.compose([Validators.required])],
      customerCode: '',
      customerName: ['', Validators.compose([Validators.required])],
      customerTax: ['', Validators.compose([Validators.required])],
      customerEmail: ['', Validators.compose([Validators.email])],
      customerPhone: '',
      customerOrg: ['', Validators.compose([Validators.required])],
      paymentType: ['', Validators.compose([Validators.required])],
      customerBankAccount: '',
      customerBank: '',
      status: '',
      customerAddress: ['', Validators.compose([Validators.required])],
      items: this.formBuilder.array([])
    }, {
        validator: (formControl: FormControl) => {
          const customerOrg = formControl.get('customerOrg').value;
          const customerName = formControl.get('customerName').value;
          if (customerName.length === 0 && customerOrg.length === 0) {
            return { invalidOrgName: true };
          }
        }
      });

    const dateFormate = moment(new Date()).format('DD-MM-YYYY');
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
    this.clearFormArray(this.itemFormArray);
    this.initNewRow();
    this.lineAmount = new Array<number>();
    this.lineAmoutWt = new Array<number>();
    this.linePriceTax = new Array<number>();
    this.lineDiscount = new Array<number>();
    this.linePriceOrigin = new Array<number>();
    this.viewMode = false;
    this.disabledEdit = true;
    this.disabledSign = true;
    this.disabledAdd = true;
  }


  /**************
   * FUNCTION CACULATOR
   */

  // Tiền chưa thuế
  private amountPopulator(idx: number, price: number, quantity: number) {
    price = price > 0 ? price : 0;
    quantity = quantity > 0 ? quantity : 0;
    const amount = price * quantity;
    this.lineAmount[idx] = amount;
  }

  // Thành Tiền
  private amountWtPopulator(idx: number) {
    const discount = this.lineDiscount[idx] > 0 ? this.lineDiscount[idx] : 0;
    const amountWt = (this.lineAmount[idx] - discount) + this.linePriceTax[idx];
    this.lineAmoutWt[idx] = amountWt;
  }

  // Tiền thuế
  private priceTaxPopulator(idx: number, taxRate: number) {
    taxRate = taxRate > 0 ? taxRate : 0;
    const discount = this.lineDiscount[idx] > 0 ? this.lineDiscount[idx] : 0;
    const tax = ((this.lineAmount[idx] - discount) * taxRate) / 100;
    this.linePriceTax[idx] = Math.round(tax);
  }

  private initSpinnerConfig() {
    this.spinnerConfig = {
      placement: SPINNER_PLACEMENT.block_ui,
      animation: SPINNER_ANIMATIONS.spin_2,
      bgColor: 'rgba(255,255,255,0.8)',
      size: '1.4rem',
      color: '#4729b7'
    };
  }
}
