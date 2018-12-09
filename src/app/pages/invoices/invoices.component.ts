import { Component, OnInit, TemplateRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InvoiceService } from '@app/_services';
import { InvoiceParam, InvoiceListData } from '@app/_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { environment } from '@env/environment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SelectData } from '@app/_models';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { TokenService } from './../../_services/app/token.service';
import { TokenData } from './../../_models/data/token.data';
import { ISpinnerConfig, SPINNER_PLACEMENT, SPINNER_ANIMATIONS } from '@hardpool/ngx-spinner';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit, AfterViewInit {
  public sortArr: string[] = ['ASC', 'DESC'];
  public sortByArr: ArrayObject = [
    { code: 'Số hóa đơn', value: 'invoiceNo' },
    { code: 'Ngày hóa đơn', value: 'invoiceDate' }
  ];

  // searching button
  public isSearching = false;

  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public spinnerConfig: ISpinnerConfig;
  public modalRef: BsModalRef;

  public signTokenLoading = false;
  public listTokenAvaiable: Array<TokenData>;
  public signErrorMessage: string;
  public signButtonDisabled = true;
  public signButtonLoading = false;



  // expand search
  public expandSearch: boolean;
  public searchForm: FormGroup;
  public page = 1;
  // pagination
  public itemsPerPage = 20;
  public totalItems = 0;
  public totalElements = 0;
  public totalPages = 0;

  public configSingleBox = {
    noResultsFound: ' ',
    showNotFound: false,
    placeholder: ' ',
    toggleDropdown: false,
    displayKey: 'select_item',
    search: false
  };

  private previousPage = 0;
  private tokenPicked: TokenData;

  // select option

  private defaultSort = 'ASC';
  private defaultSortBy = 'invoiceNo';

  private token: string;
  private tenant: string;
  private detailApi: string;

  constructor(
    private modalService: BsModalService,
    private ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    private router: Router,
    private tokenService: TokenService,
    private authenticationService: AuthenticationService,
    private activeRouter: ActivatedRoute,
    private invoiceService: InvoiceService,
    private formBuilder: FormBuilder
  ) {
    this.token = authenticationService.credentials.token;
    this.tenant = authenticationService.credentials.tenant;
    this.detailApi = `${environment.serverUrl}/${this.tenant}/invoices`;
  }

  ngOnInit() {
    this.initDefault();
    this.initDataTable();
    this.initForm();
    this.initPageHandlerInRouter();
    this.initSpinnerConfig();
  }

  ngAfterViewInit() {
    $('#copyLoading').hide();

    function copyToClipboard(text: string) {
      const $temp = $('<input>');
      $('body').append($temp);
      $temp.val(text).select();
      document.execCommand('copy');
      $temp.remove();
    }

    // handle copy button
    $('#copyButton').on('click', function (e: any) {
      e.preventDefault();

      // loading
      $('#copyLoading').show();
      $('#copyLoaded').hide();

      const row = $('#invoiceTable tbody').find('tr.selected')[0];
      let customerText = '';
      $(row).find('td').each(function (index: any) {
        const tdText = $(this).text();
        if (tdText && tdText.trim().length > 0) {
          if (index !== 1) {
            customerText += ',';
          }
          customerText += tdText;
        }
      });
      console.log(customerText);
      copyToClipboard(customerText);

      setTimeout(function () {
        $('#copyLoading').hide();
        $('#copyLoaded').show();
      }, 500);
    });
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('expandSearch', JSON.stringify(this.expandSearch));
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public openModalMd(template: TemplateRef<any>) {
    this.loadTokenData();
    this.modalRef = this.modalService.show(template, { class: 'modal-token' });
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
    localStorage.setItem('token-picked', JSON.stringify(this.tokenPicked));
    const invoiceId = +this.getCheckboxesValue();
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
        this.modalRef.hide();
        this.signButtonDisabled = false;
        this.signButtonLoading = false;
        const initialState = {
          message: 'Đã ký thành công hóa đơn!',
          title: 'Thông báo!',
          class: 'success',
          highlight: `Hóa đơn #${invoiceId}`
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      }, err => {
        this.errorSignHandler(err);
      });
    }
  }

  public onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const invoiceParam: InvoiceParam = this.formatForm(form);
    invoiceParam.page = JSON.stringify(this.page);
    localStorage.setItem('userquery', JSON.stringify(invoiceParam));
    this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
    this.callServiceAndBindTable(invoiceParam);
  }

  public onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;
      const userquery = localStorage.getItem('userquery');
      let invoiceParam: InvoiceParam;
      if (userquery) {
        invoiceParam = JSON.parse(userquery);
      } else {
        invoiceParam = {};
      }

      invoiceParam.page = JSON.stringify(this.page);

      // call service
      this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
      this.callServiceAndBindTable(invoiceParam);
    }
  }

  // BUTTON ACTION
  public openRowClicked() {
    const invoiceId = this.getCheckboxesValue();
    console.log(invoiceId);
    window.open(`/invoices/open/${invoiceId}`, '_blank');
  }

  public copyRowClicked() {
    const item = this.getCheckboxesValue();
  }

  public printRowClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.print(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.ref.markForCheck();
      window.open(fileURL);
    }, err => {
      this.ref.markForCheck();
      this.errorHandler(err);
    });
  }

  public printTransformRowClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.printTransform(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.ref.markForCheck();
      window.open(fileURL);
    }, err => {
      this.ref.markForCheck();
      this.errorHandler(err);
    });
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

  public approveClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.approveInvoice(invoiceId).subscribe(
      data => {
        console.log(JSON.stringify(data));
      },
      err => {
        this.errorHandler(err);
      }
    );
  }

  public receiveExcelClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.disposeInvoice(invoiceId).subscribe(
      data => {
        console.log(JSON.stringify(data));
      },
      err => {
        this.errorHandler(err);
      }
    );
  }

  public disposeConfirmClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.disposeInvoice(invoiceId).subscribe(
      data => {
        this.modalRef.hide();
        const initialState = {
          message: 'Đã hủy hóa đơn thành công!',
          title: 'Thành công!',
          class: 'success',
          highlight: `Hóa đơn #${data.invoice_id}`
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      },
      err => {
        this.modalRef.hide();
        this.errorHandler(err);
      }
    );
  }

  // END BUTTON ACTION

  private getCheckboxesValue() {
    const itemsChecked = new Array<string>();
    $('input:checkbox[name=stickchoice]:checked').each(function () {
      const item: string = $(this).val();
      itemsChecked.push(item);
    });
    return itemsChecked;
  }

  private initPageHandlerInRouter() {
    if (this.activeRouter.snapshot.queryParams) {
      const routerParams = JSON.parse(JSON.stringify(this.activeRouter.snapshot.queryParams));
      if (routerParams['page']) {
        this.page = +routerParams['page'];
        this.previousPage = +routerParams['page'];
      }

      // set default value form
      (<FormGroup>this.searchForm).patchValue(routerParams, { onlySelf: true });
    }
    const invoiceParam: InvoiceParam = { page: JSON.stringify(this.page) };
    // call service
    this.callServiceAndBindTable(invoiceParam);
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('expandSearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
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

  private errorHandler(err: any) {
    const initialState = {
      message: 'Something went wrong',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error) {
      initialState.message = err.error.message;
    }
    this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
  }

  private callServiceAndBindTable(params: InvoiceParam) {
    this.invoiceService.queryInvoices(params).subscribe((data: any) => {
      if (data) {
        const invoiceList = data as InvoiceListData;
        if (invoiceList.contents.length > 0) {
          this.totalElements = invoiceList.total_elements;
          this.totalPages = invoiceList.total_pages;
          this.totalItems = invoiceList.total_pages * this.itemsPerPage;

          $('#invoiceTable')
            .dataTable()
            .fnClearTable();
          $('#invoiceTable')
            .dataTable()
            .fnAddData(invoiceList.contents);
        }
      }

      this.isSearching = false;
    }, err => {
      this.isSearching = false;
      this.errorHandler(err);
    });
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      sort: '',
      sortBy: '',
      size: '',
      fromDate: '',
      toDate: '',
      invoiceNo: '',
      form: '',
      serial: '',
      orgTaxCode: ''
    });

    this.searchForm.controls['sort'].setValue(this.defaultSort, { onlySelf: true });
    this.searchForm.controls['sortBy'].setValue(this.defaultSortBy, { onlySelf: true });
  }

  private initDataTable() {
    const $data_table = $('#invoiceTable');
    const table = $data_table.DataTable({
      paging: false,
      searching: false,
      retrieve: true,
      serverSide: false,
      bLengthChange: false,
      info: false,
      scrollX: true,
      iDisplayLength: 20,
      language: {
        emptyTable: 'Không có dữ liệu'
      },
      createdRow: function (row: any, data: any, index: number) {
        $(row).addClass('row-parent');
      },
      columnDefs: [{
        width: '20px',
        targets: 0,
        orderable: false
      },
      {
        width: '80px',
        targets: 1,
        render: function (data: any) {
          return '<label class="badge badge-info">' + data + '</label>';
        }
      },
      {
        width: '60px',
        targets: 2
      },
      {
        width: '80px',
        targets: 3
      },
      {
        width: '60px',
        targets: 4
      },
      {
        width: '50px',
        targets: 6,
        render: function (data: any) {
          if (data && data !== 'null') {
            return '<span class="number-format">' + data + '</span>';
          } else {
            return '<span></span>';
          }
        }
      },
      {
        width: '50px',
        targets: 7,
        render: function (data: any) {
          if (data && data !== 'null') {
            return '<span class="number-format">' + data + '</span>';
          } else {
            return '<span></span>';
          }
        }
      },
      {
        width: '80px',
        targets: 8,
        render: function (data: any) {
          if (data && data !== 'null') {
            return '<span class="number-format">' + data + '</span>';
          } else {
            return '<span></span>';
          }
        }
      }
      ],
      columns: [{
        orderable: false,
        className: 'action-control',
        data: function (row: any, type: any) {
          if (type === 'display' && row.invoice_id && row.invoice_id !== 'null') {
            return `
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" name="stickchoice" value="${row.invoice_id}" class="form-check-input">
                  <i class="input-helper"></i></label>
                  <input type="hidden" class="invoice-hidden" value="${row.invoice_id}">
              </div>
            `;
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: 'invoice_no'
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display' && row.invoice_date && row.invoice_date !== 'null') {
            const dateFormate = moment(row.invoice_date).format('DD/MM/YYYY');
            return `<span>${dateFormate}</span>`;
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display' && row.customer && row.customer !== 'null') {
            return row.customer.customer_name;
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display' && row.customer && row.customer !== 'null') {
            return row.customer.tax_code;
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display' && row.customer && row.customer !== 'null') {
            return row.customer.address;
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display') {
            return formatCurrency(row.total_before_tax);
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display') {
            return formatCurrency(row.total_tax);
          } else {
            return '<span></span>';
          }
        }
      },
      {
        data: function (row: any, type: any) {
          if (type === 'display') {
            return formatCurrency(row.total);
          } else {
            return '<span></span>';
          }
        }
      }
      ],
      select: {
        style: 'single',
        items: 'cells',
        info: false
      },
      order: [[2, 'desc']],
      drawCallback: function () {
        const pagination = $(this)
          .closest('.dataTables_wrapper')
          .find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });

    function bindButtonStatus(status: boolean) {
      $('#openButton').prop('disabled', status);
      $('#copyButton').prop('disabled', status);
      $('#printButton').prop('disabled', status);
      $('#printTranformButton').prop('disabled', status);
      $('#signButton').prop('disabled', status);
      $('#approveButton').prop('disabled', status);
      $('#disposeButton').prop('disabled', status);
    }

    function formatCurrency(price: number) {
      if (price > 0) {
        return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
      return price;
    }

    // disabled all button
    bindButtonStatus(true);

    $('#invoiceTable tbody').on('dblclick', 'tr.row-parent', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      const invoiceId = $(this).find('.invoice-hidden').val();
      const openUrl = window.location.origin + '/invoices/open/' + invoiceId;
      window.open(openUrl, '_blank');
    });

    // selected row
    $('#invoiceTable tbody').on('click', 'tr.row-parent', function () {
      console.log('click tr');
      $('input:checkbox[name=stickchoice]').each(function () {
        $(this).prop('checked', false);
      });

      // find expand
      console.log($(this));

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', false);

        bindButtonStatus(true);
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', true);

        bindButtonStatus(false);
      }
      return false;
    });
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

  private formatForm(form: any) {
    const invoiceParamsForamat: InvoiceParam = {};
    if (form.sort) {
      invoiceParamsForamat.sort = form.sort;
    }
    if (form.sortBy) {
      invoiceParamsForamat.sortBy = form.sortBy;
    }
    if (form.size) {
      invoiceParamsForamat.size = form.size;
    }

    if (form.fromDate) {
      invoiceParamsForamat.fromDate = form.fromDate;
    }
    if (form.toDate) {
      invoiceParamsForamat.toDate = form.toDate;
    }
    if (form.invoiceNo) {
      invoiceParamsForamat.invoiceNo = form.invoiceNo;
    }
    if (form.form) {
      invoiceParamsForamat.form = form.form;
    }
    if (form.serial) {
      invoiceParamsForamat.serial = form.serial;
    }
    if (form.orgTaxCode) {
      invoiceParamsForamat.orgTaxCode = form.orgTaxCode;
    }
    return invoiceParamsForamat;
  }
}
