import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InvoiceService, ReferenceService } from '@app/_services';
import { InvoiceParam, InvoiceListData, SelectData } from '@app/_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { TokenService } from './../../_services/app/token.service';
import { TokenData } from './../../_models/data/token.data';
import { ISpinnerConfig, SPINNER_PLACEMENT, SPINNER_ANIMATIONS } from '@hardpool/ngx-spinner';
import { NgSelectConfig } from '@ng-select/ng-select';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {
  public sortArr: ArrayObject = [
    { value: 'Tăng dần', code: 'ASC' },
    { value: 'Giảm dần', code: 'DESC' }
  ];
  public sortByArr: ArrayObject = [
    { value: 'Số hóa đơn', code: 'invoiceNo' },
    { value: 'Ngày hóa đơn', code: 'invoiceDate' }
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
  public disposeDisabled = true;
  public disposeButtonLoading = false;
  public printLoading = false;

  public formLoading = false;
  public serialLoading = false;
  public statusLoading = false;

  public comboForm: SelectData[];
  public comboSerial: SelectData[];
  public comboStatus: SelectData[];
  public comboInvoiceType: SelectData[];

  // expand search
  public expandSearch: boolean;
  public searchForm: FormGroup;
  public page = 1;
  // pagination
  public itemsPerPage = 20;
  public totalItems = 0;
  public totalElements = 0;
  public totalPages = 0;
  public pageSizeList = new Array<any>(); 
  public sizeNumber: any;

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

  constructor(
    private config: NgSelectConfig,
    private modalService: BsModalService,
    private ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    private router: Router,
    private tokenService: TokenService,
    private referenceService: ReferenceService,
    private authenticationService: AuthenticationService,
    private activeRouter: ActivatedRoute,
    private invoiceService: InvoiceService,
    private formBuilder: FormBuilder
  ) {
    this.config.notFoundText = 'Không có dữ liệu';
    this.config.loadingText = 'Đang tải..';
    this.config.addTagText = 'Thêm';
  }

  ngOnInit() {
    this.initDefault();
    this.initForm();
    this.initSpinnerConfig();
    this.initDataReference();
  }

  public resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      sort: 'DESC',
      sortBy: 'invoiceNo'
    });
    this.onSubmit(this.searchForm.value);
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
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-sm' });
  }

  public openModalMd(template: TemplateRef<any>) {
    this.signErrorMessage = '';
    this.loadTokenData();
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-token' });
  }

  public onTokenChange(token: any) {
    this.signErrorMessage = '';
    if (token) {
      this.signButtonDisabled = false;
      this.disposeDisabled = false;
      this.tokenPicked = token;
    }
  }

  public async tokenChoiceClicked() {
    this.signButtonDisabled = true;
    this.signButtonLoading = true;
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
        this.reloadPage();
        const initialState = {
          message: 'Đã ký thành công hóa đơn!',
          title: 'Thông báo!',
          class: 'success',
          highlight: `Hóa đơn #${invoiceId}`
        };
        this.modalRef = this.modalService.show(AlertComponent, {animated: false, class: 'modal-sm', initialState });
      }, err => {
        this.errorSignHandler(err);
      });
    }
  }

  public onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const invoiceParam: InvoiceParam = this.formatForm(form);
    invoiceParam.page = +this.page;
    invoiceParam.size = +this.sizeNumber;

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

      invoiceParam.page = +this.page;
      invoiceParam.size = this.pageSizeList[0].code;

      localStorage.setItem('userquery', JSON.stringify(invoiceParam));
      // call service
      this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
      this.callServiceAndBindTable(invoiceParam);
    }
  }

  public onSizeChange(sizeObj: any) {
    let size = 20;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const userquery = localStorage.getItem('userquery');
    let invoiceParam: InvoiceParam;
    if (userquery) {
      invoiceParam = JSON.parse(userquery);
    } else {
      invoiceParam = {};
    }
    invoiceParam.page = 1;
    invoiceParam.size = size;

    localStorage.setItem('userquery', JSON.stringify(invoiceParam));
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
    this.callServiceAndBindTable(invoiceParam);

    $('#invoiceTable').DataTable().page.len(size).draw();
  }

  // BUTTON ACTION
  public openRowClicked() {
    const invoiceId = this.getCheckboxesValue();
    this.router.navigate([`/invoices/open/${invoiceId}`]);
  }

  public openAdjustClicked() {
    const invoiceId = this.getCheckboxesValue();
    this.router.navigate([`/invoices/open/${invoiceId}/adjust`]);
  }

  public openReplaceClicked() {
    const invoiceId = this.getCheckboxesValue();
    this.router.navigate([`/invoices/open/${invoiceId}/replace`]);
  }

  public copyRowClicked() {
    const invoiceId = this.getCheckboxesValue();
    this.router.navigate([`/invoices/copy/${invoiceId}`]);
  }

  public printRowClicked() {
    this.printLoading = true;
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.print(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.ref.markForCheck();
      window.open(fileURL, '_blank');
      setTimeout(function () {
        this.printLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      this.errorHandler(err);
      this.ref.markForCheck();
    });
  }

  public printTransformRowClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.printTransform(invoiceId).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }, err => {
      const initialState = {
        message: 'Hóa đơn chỉ được in chuyển đổi một lần!',
        title: 'Hóa đơn đã in chuyển đổi',
        class: 'error'
      };
      this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
    });
  }

  public onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.searchForm.patchValue({
        serial: ''
      });
      const serialJson = sessionStorage.getItem('comboSerial');
      if (serialJson) {
        this.comboSerial = JSON.parse(serialJson) as SelectData[];
      }
      return;
    }
    this.loadSerialByForm(selectData.value);
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
      this.signErrorMessage = 'Có lỗi khi tương tác với Plugin, xin hãy kiểm tra lại AHoadon Plugin!';
      setTimeout(function () {
        this.signTokenLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    });
  }

  public approveClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.approveInvoice(invoiceId).subscribe(
      data => {
        this.modalRef.hide();
        const initialState = {
          message: 'Đã duyệt hóa đơn thành công!',
          title: 'Thành công!',
          class: 'success',
          highlight: `Hóa đơn #${invoiceId}`
        };
        this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
        this.reloadPage();
      },
      err => {
        this.modalRef.hide();
        this.errorHandler(err);
      }
    );
  }

  public disposeConfirmToken(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.loadTokenData();
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-token' });
  }

  public disposeConfirmClicked() {
    const invoiceId = +this.getCheckboxesValue();
    const status = this.getStatusValue();
    if (status === 'SIGNED') {
      this.invoiceService.disposeSignedInvoice(invoiceId).subscribe(
        data => {
          this.modalRef.hide();
          const initialState = {
            message: 'Đã hủy hóa đơn thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Hóa đơn #${data.invoice_id}`
          };
          this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
          this.reloadPage();
        },
        err => {
          this.modalRef.hide();
          this.errorHandler(err);
        });
    } else {
      this.invoiceService.disposeInvoice(invoiceId).subscribe(
        data => {
          this.modalRef.hide();
          const initialState = {
            message: 'Đã hủy hóa đơn thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Hóa đơn #${data.invoice_id}`
          };
          this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
        },
        err => {
          this.modalRef.hide();
          this.errorHandler(err);
        });
    }
  }

  public dummyPageSize() {
    return [{
      "code": 20,
      "value": '20'
    }, {
      "code": 50,
      "value": '50'
    }, {
      "code": 100,
      "value": '100'
    }];
  }

  // END BUTTON ACTION
  private getCheckboxesValue(): any {
    const itemsChecked = new Array<string>();
    $('input:checkbox[name=stickchoice]:checked').each(function () {
      const item: string = $(this).val();
      itemsChecked.push(item);
    });
    if (itemsChecked.length > 0) {
      return itemsChecked[0];
    }
    return 0;
  }

  private getStatusValue() {
    const itemsChecked = new Array<string>();
    $('input:checkbox[name=stickchoice]:checked').each(function () {
      const parent = $(this).closest('.form-check');
      const status = parent.find('.status-hidden').val();
      itemsChecked.push(status);
    });
    if (itemsChecked.length > 0) {
      return itemsChecked[0];
    }
    return '';
  }

  private initRouter() {
    if (this.activeRouter.snapshot.queryParams) {
      let routerParams = JSON.parse(JSON.stringify(this.activeRouter.snapshot.queryParams));
      console.log('routerParams: ' + JSON.stringify(routerParams));
      if (Object.keys(routerParams).length !== 0) {
        if (routerParams['page']) {
          this.page = +routerParams['page'];
          this.previousPage = +routerParams['page'];
        }
        if (routerParams['size']) {
          this.sizeNumber = +routerParams['size'];
        }
        if (routerParams['fromDate']) {
          routerParams['fromDate'] = this.convertDatetoDisplay(routerParams['fromDate']);
        }
        if (routerParams['toDate']) {
          routerParams['toDate'] = this.convertDatetoDisplay(routerParams['toDate']);
        }

        localStorage.setItem('userquery', JSON.stringify(routerParams));
      }
    }
    this.reloadPage();
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('expandSearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
  }

  private convertDatetoDisplay(date: string) {
    const momentDate = moment(date, 'YYYY-MM-DD');
    return momentDate.format('DD-MM-YYYY');
  }

  private convertDateToQuery(date: string) {
    const momentDate = moment(date, 'DD-MM-YYYY');
    return momentDate.format('YYYY-MM-DD');
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
    this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
  }

  private callServiceAndBindTable(params: InvoiceParam) {
    this.isSearching = true;
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
        } else {
          this.totalElements = 0;
          this.totalPages = 0;
          this.totalItems = 0;
          $('#invoiceTable')
            .dataTable()
            .fnClearTable();
        }
      }

      setTimeout(function () {
        this.isSearching = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      this.router.navigate(['/500']);
    });
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      sort: '',
      sortBy: '',
      fromDate: '',
      toDate: '',
      invoiceNo: '',
      form: '',
      status: '',
      serial: '',
      orgTaxCode: ''
    });

    this.searchForm.patchValue({
      sort: 'DESC',
      sortBy: 'invoiceNo'
    });
  }

  private getDataStatus(): any {
    const json = sessionStorage.getItem('comboStatus');
    let arr: any;
    if (json) {
      arr = JSON.parse(json) as SelectData[];
    }
    return arr;
  }

  private getDataInvoiceType(): any {
    const json = sessionStorage.getItem('comboInvoiceType');
    let arr: any;
    if (json) {
      arr = JSON.parse(json) as SelectData[];
    }
    return arr;
  }

  private initDataTable() {
    const statusArr = this.getDataStatus();
    const invoiceTypeArr = this.getDataInvoiceType();

    const table = $('#invoiceTable').DataTable({
      paging: false,
      searching: false,
      retrieve: false,
      serverSide: false,
      bLengthChange: false,
      info: false,
      scrollX: true,
      iDisplayLength: 20,
      language: {
        emptyTable: 'Không có dữ liệu'
      },
      createdRow: function (row: any) {
        $(row).addClass('row-parent');
      },
      columnDefs: [{
        width: '16px',
        searchable: false,
        orderable: false,
        targets: 0
      }, {
        width: '50px',
        targets: 1,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            if (statusArr) {
              const status = statusArr.find((i: SelectData) => (i.code === cellData));
              $(td).html(status.value);
            }
          }
        }
      }, {
        width: '50px',
        targets: 2,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            if (invoiceTypeArr) {
              const invoiceType = invoiceTypeArr.find((i: SelectData) => (i.code === cellData));
              $(td).html(invoiceType.value);
            }
          }
        }
      }, {
        width: '50px',
        targets: 3,
        createdCell: function (td: any, cellData: string) {
          $(td).html(`<span class="text-bold">${cellData}</span>`);
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
          }
        }
      }, {
        width: '60px',
        targets: 4,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const dateFormate = moment(cellData).format('DD/MM/YYYY');
            $(td).html(dateFormate);
          }
        }
      }, {
        targets: 5,
        orderable: false,
      }, {
        width: '60px',
        targets: 6,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
          }
        }
      }, {
        width: '70px',
        targets: 7,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const cellformat = formatCurrency(cellData);
            $(td).html(cellformat);
          }
        }
      },
      {
        width: '70px',
        targets: 8,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const cellformat = formatCurrency(cellData);
            $(td).html(cellformat);
          }
        }
      },
      {
        width: '70px',
        targets: 9,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const cellformat = formatCurrency(cellData);
            $(td).html(cellformat);
          }
        }
      }
      ],
      columns: [{
        className: 'text-bold',
        data: 'invoice_id'
      }, {
        data: 'status'
      }, {
        data: 'invoice_type'
      },
      {
        data: 'invoice_no'
      },
      {
        data: 'invoice_date'
      },
      {
        className: 'lh-medium cbox',
        data: function (row: any, type: any) {
          if (type === 'display'
            && row.customer
            && row.customer.org) {
            const org: string = row.customer.org;
            let orgFormat: string;
            if (org.length <= 65) {
              orgFormat = org;
            } else {
              orgFormat = org.substring(0, 65);
              const lastWordIndex = orgFormat.lastIndexOf(' ');
              orgFormat = orgFormat.substring(0, lastWordIndex) + '...';
            }
            return `
              <span class="lh-medium" title="${org}">${orgFormat}</span>
              <div class="hidden-col">
                <input type="checkbox" name="stickchoice" value="${row.invoice_id}" class="td-checkbox-hidden">
                <input type="hidden" class="id-hidden" value="${row.invoice_id}">
                <input type="hidden" class="status-hidden" value="${row.status}">
                <input type="hidden" class="type-hidden" value="${row.invoice_type}">
              </div>
            `;
          } else {
            return '';
          }
        }
      }, {
        data: 'customer.tax_code'
      }, {
        className: 'text-right',
        data: 'total_before_tax'
      },
      {
        className: 'text-right',
        data: 'total_tax'
      },
      {
        className: 'text-right',
        data: 'total'
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

    table.on('order.dt search.dt', function () {
      table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell: any, i: number) {
        cell.innerHTML = i + 1;
      });
    }).draw();

    function formatCurrency(price: number) {
      if (price > 0) {
        return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      }
      return price;
    }

    // disabled all button
    $('#openButton').prop('disabled', true);
    $('#copyButton').prop('disabled', true);
    $('#printButton').prop('disabled', true);
    $('#approveButton').prop('disabled', true);
    $('#disposeButton').prop('disabled', true);
    $('#signButton').prop('disabled', true);
    $('#printTranformButton').prop('disabled', true);
    $('#adjustButton').prop('disabled', true);
    $('#replaceButton').prop('disabled', true);

    $('#invoiceTable tbody').on('click', 'tr.row-parent > td > span', function (event: any) {
      event.preventDefault();
      event.stopPropagation();
      const tr = $(this).closest('tr');
      tr.click();
    });

    // selected row
    let clicks = 0;
    $('#invoiceTable tbody').on('click', 'tr.row-parent', function (event: any) {
      event.preventDefault();
      clicks++;
      setTimeout(function () { clicks = 0; }, 300);
      if (clicks === 2) {
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', true);
        $('#openButton').click();
      } else {
        if (!$(this).hasClass('selected')) {
          $('input:checkbox[name=stickchoice]').each(function () {
            $(this).prop('checked', false);
          });

          // init status
          $('#signButton').prop('disabled', true);
          $('#printTranformButton').prop('disabled', true);
          $('#adjustButton').prop('disabled', false);
          $('#replaceButton').prop('disabled', false);

          table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
          $(this)
            .find('input:checkbox[name=stickchoice]')
            .prop('checked', true);

          const status = $(this).find('.status-hidden').val();
          const type = $(this).find('.type-hidden').val();

          if (status === 'DISPOSED') {
            $('#signButton').prop('disabled', true);
            $('#printTranformButton').prop('disabled', true);
            $('#openButton').prop('disabled', false);
            $('#copyButton').prop('disabled', true);
            $('#printButton').prop('disabled', false);
            $('#approveButton').prop('disabled', true);
            $('#disposeButton').prop('disabled', true);
            $('#adjustButton').prop('disabled', true);
            $('#replaceButton').prop('disabled', true);
          } else {
            if (status === 'CREATED') {
              $('#signButton').prop('disabled', false);
            }
            $('#openButton').prop('disabled', false);
            $('#copyButton').prop('disabled', false);
            $('#printButton').prop('disabled', false);
            $('#approveButton').prop('disabled', false);
            $('#disposeButton').prop('disabled', false);
            $('#printTranformButton').prop('disabled', false);
            if (status === 'SIGNED') {
              $('#approveButton').prop('disabled', false);
              $('#printTranformButton').prop('disabled', false);
              $('#signButton').prop('disabled', true);
            }

            if (status === 'APPROVED') {
              $('#printTranformButton').prop('disabled', false);
              $('#approveButton').prop('disabled', true);
              $('#signButton').prop('disabled', true);
            }
          }

          if (type === 'REPLACE' || type === 'REPLACED') {
            $('#replaceButton').prop('disabled', true);
          }
          if (type === 'ADJ' || type === 'ADJED') {
            $('#adjustButton').prop('disabled', true);
          }
        }
      }
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
    if (form.fromDate) {
      const fromDate = this.convertDateToQuery(form.fromDate);
      invoiceParamsForamat.fromDate = fromDate;
    }
    if (form.toDate) {
      const toDate = this.convertDateToQuery(form.toDate);
      invoiceParamsForamat.toDate = toDate;
    }
    if (form.invoiceNo && form.invoiceNo.length > 0) {
      invoiceParamsForamat.invoiceNo = form.invoiceNo.trim();
    }
    if (form.form) {
      invoiceParamsForamat.form = form.form;
    }
    if (form.serial) {
      invoiceParamsForamat.serial = form.serial;
    }
    if (form.orgTaxCode && form.orgTaxCode.length > 0) {
      invoiceParamsForamat.orgTaxCode = form.orgTaxCode.trim();
    }
    if (form.status) {
      invoiceParamsForamat.status = form.status;
    }
    return invoiceParamsForamat;
  }

  private initDataReference() {
    this.pageSizeList = this.dummyPageSize();
    this.sizeNumber = 20; 

    // check in session
    let json = sessionStorage.getItem('comboStatus');
    if (json) {
      this.comboStatus = JSON.parse(json) as SelectData[];
    }

    json = sessionStorage.getItem('comboInvoiceType');
    if (json) {
      this.comboInvoiceType = JSON.parse(json) as SelectData[];
    }

    json = sessionStorage.getItem('comboForm');
    if (json) {
      this.comboForm = JSON.parse(json) as SelectData[];
    }

    json = sessionStorage.getItem('comboSerial');
    if (json) {
      this.comboSerial = JSON.parse(json) as SelectData[];
    }

    if (this.comboStatus && this.comboForm && this.comboInvoiceType) {
      this.initDataTable();
      this.initRouter();
      this.ref.markForCheck();
      return;
    }

    // reset object
    this.formLoading = true;
    this.serialLoading = true;
    const comboForm = new Array<SelectData>();
    const comboStatus = new Array<SelectData>();
    const comboInvoiceType = new Array<SelectData>();

    const comboTaxRate = new Array<SelectData>();
    const comboHTTT = new Array<SelectData>();
    const comboSerial = new Array<SelectData>();

    // check session
    const comboFormStr = sessionStorage.getItem('comboForm');
    if (comboFormStr) {
      this.comboForm = JSON.parse(comboFormStr);
    }
    const comboSerialStr = sessionStorage.getItem('comboSerial');
    if (comboSerialStr) {
      this.comboSerial = JSON.parse(comboSerialStr);
    }
    if (this.comboForm && this.comboSerial) {
      this.initDataTable();
      this.initRouter();
      this.resetLoading();
      return;
    }

    // load from references
    this.referenceService.referenceInfo().subscribe((items: SelectData[]) => {
      const selectItems = items as SelectData[];
      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectData();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          comboTaxRate.push(selectItem);
        }

        if (selectItem.type === 'COMBO_FORM') {
          comboForm.push(selectItem);
        }

        if (selectItem.type === 'COMBO_PAYMENT') {
          comboHTTT.push(selectItem);
        }
        if (selectItem.type === 'COMBO_INVOICE_STATUS') {
          comboStatus.push(selectItem);
        }
        if (selectItem.type === 'COMBO_INVOICE_TYPE') {
          comboInvoiceType.push(selectItem);
        }
        if (selectItem.type.startsWith('COMBO_SERIAL_')) {
          comboSerial.push(selectItem);
        }
      }

      this.storeDataSession(comboHTTT, comboTaxRate, comboSerial, comboForm, comboStatus, comboInvoiceType);
      this.comboSerial = comboSerial;
      this.comboForm = comboForm;
      this.comboStatus = comboStatus;
      this.comboInvoiceType = comboInvoiceType;
      this.initDataTable();
      this.initRouter();
      this.resetLoading();
    }, err => {
      this.resetLoading();
      this.errorHandler(err);
    });
  }

  private storeDataSession(comboHTTT: any, comboTaxRate: any,
    comboSerial: any, comboForm: any, comboStatus: any, comboInvoiceType: any) {
    // set default value
    sessionStorage.setItem('comboForm', JSON.stringify(comboForm));
    sessionStorage.setItem('comboHTTT', JSON.stringify(comboHTTT));
    sessionStorage.setItem('comboTaxRate', JSON.stringify(comboTaxRate));
    sessionStorage.setItem('comboStatus', JSON.stringify(comboStatus));
    sessionStorage.setItem('comboSerial', JSON.stringify(comboSerial));
    sessionStorage.setItem('comboInvoiceType', JSON.stringify(comboInvoiceType));
  }

  private reloadPage() {
    let invoiceParam: InvoiceParam;

    const userquery = localStorage.getItem('userquery');
    if (userquery) {
      invoiceParam = JSON.parse(userquery);
      this.page = invoiceParam.page;
      this.sizeNumber = +invoiceParam.size;

      // set default value form
      (<FormGroup>this.searchForm).patchValue(invoiceParam, { onlySelf: true });
    } else {
      invoiceParam = {
        page: +this.page,
        size: this.pageSizeList[0].code
      };
    }
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });

    this.callServiceAndBindTable(invoiceParam);
  }

  private resetLoading() {
    setTimeout(function () {
      this.formLoading = false;
      this.serialLoading = false;
      this.ref.markForCheck();
    }.bind(this), 200);
  }

  private loadSerialByForm(form: string) {
    this.serialLoading = true;
    const comboSerialArr = new Array<SelectData>();
    const comboType = `COMBO_SERIAL_${form}`;
    const comboSerialJson = JSON.parse(sessionStorage.getItem('comboSerial'));
    if (comboSerialJson) {
      comboSerialJson.forEach((item: SelectData, index: number) => {
        if (item.type === comboType) {
          comboSerialArr.push(item);
        }
      });
      this.comboSerial = comboSerialArr;
    }

    // set default picked
    setTimeout(function () {
      this.serialLoading = false;
    }.bind(this), 200);
  }
}
