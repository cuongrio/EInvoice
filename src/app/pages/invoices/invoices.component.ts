import { Component, OnInit, TemplateRef } from '@angular/core';
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

import { AlertComponent } from '@app//shared/alert/alert.component';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {
  public sortArr: string[] = ['ASC', 'DESC'];
  public sortByArr: ArrayObject = [
    { code: 'invoiceNo', value: 'Số hóa đơn' },
    { code: 'fromDate', value: 'Từ ngày' },
    { code: 'toDate', value: 'Đến ngày' },
    { code: 'serial', value: 'Số Serial' },
    { code: 'orgTaxCode', value: 'Mã số thuế' }
  ];

  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public modalRef: BsModalRef;
  // expand search
  public expandSearch: boolean;
  public searchForm: FormGroup;
  public page = 1;
  // pagination
  public itemsPerPage = 20;
  public totalItems = 0;
  public totalElements = 0;
  public totalPages = 0;

  private previousPage = 0;

  // select option

  private defaultSort = 'ASC';
  private defaultSortBy = 'invoiceNo';

  private token: string;
  private tenant: string;
  private detailApi: string;

  constructor(
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private router: Router,
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
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('expandSearch', JSON.stringify(this.expandSearch));
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public onSubmit(form: any) {
    this.page = 1;
    const invoiceParam: InvoiceParam = this.formatForm(form);
    invoiceParam.page = JSON.stringify(this.page);
    localStorage.setItem('userquery', JSON.stringify(invoiceParam));
    this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
    this.callServiceAndBindTable(invoiceParam);
  }

  public onPageChange(page: number) {
    console.log(this.previousPage + '---' + page);
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
      console.log('invoiceParams: ' + JSON.stringify(invoiceParam));

      // call service
      this.router.navigate([], { replaceUrl: true, queryParams: invoiceParam });
      this.callServiceAndBindTable(invoiceParam);
    }
  }

  // BUTTON ACTION
  public openRowClicked() {
    const invoiceId = this.getCheckboxesValue();
    this.router.navigate([`/invoices/open/${invoiceId}`]);
  }

  public copyRowClicked() {
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public printRowClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.print(invoiceId).subscribe(data => {
      console.log('data: ' + JSON.stringify(data));
    });
  }

  public printTransformRowClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.printTransform(invoiceId).subscribe(data => {
      console.log('data: ' + JSON.stringify(data));
    });
  }

  public signClicked() {
    const invoiceId = +this.getCheckboxesValue();
    // 1. get list token
    this.invoiceService.listToken().subscribe((data: Array<any>) => {
      console.log(JSON.stringify(data));
    });

    // this.invoiceService.sign(invoiceId).subscribe(data => {
    //   console.log('data: ' + JSON.stringify(data));
    // });
  }

  public approveClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.approveInvoice(invoiceId).subscribe(data => {
      console.log(JSON.stringify(data));
    }, err => {
      const initialState = {
        message: 'Something went wrong',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    });
  }

  public receiveExcelClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.disposeInvoice(invoiceId).subscribe(data => {
      console.log(JSON.stringify(data));
    }, err => {
      const initialState = {
        message: 'Something went wrong',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    });
  }

  public disposeConfirmClicked() {
    const invoiceId = +this.getCheckboxesValue();
    this.invoiceService.disposeInvoice(invoiceId).subscribe(data => {
      this.modalRef.hide();
      const initialState = {
        message: 'Đã hủy hóa đơn thành công!',
        title: 'Thành công!',
        class: 'success',
        highlight: `Hóa đơn #${data.invoice_id}`
      };
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    }, err => {
      this.modalRef.hide();
      const initialState = {
        message: 'Something went wrong',
        title: 'Đã có lỗi!',
        class: 'error'
      };

      if (err.error) {
        initialState.message = err.error.message;
      }
      this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    });
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

  private callServiceAndBindTable(params: InvoiceParam) {
    this.invoiceService.queryInvoices(params).subscribe(
      (data: any) => {
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
      columnDefs: [
        {
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
        },
        {
          width: '20px',
          targets: 9
        }
      ],
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: ''
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
        }, {
          data: function (row: any, type: any) {
            if (type === 'display' && row.customer && row.customer !== 'null') {
              return row.customer.address;
            } else {
              return '<span></span>';
            }
          }
        }, {
          data: function (row: any, type: any) {
            if (type === 'display') {
              return formatCurrency(row.total_before_tax);
            } else {
              return '<span></span>';
            }
          }
        }, {
          data: function (row: any, type: any) {
            if (type === 'display') {
              return formatCurrency(row.total_tax);
            } else {
              return '<span></span>';
            }
          }
        }, {
          data: function (row: any, type: any) {
            if (type === 'display') {
              return formatCurrency(row.total);
            } else {
              return '<span></span>';
            }
          }
        }, {
          orderable: false,
          data: function (row: any, type: any) {
            if (type === 'display' && row.invoice_id && row.invoice_id !== 'null') {
              return `
                <div class="form-check">
                  <label class="form-check-label">
                    <input type="checkbox" name="stickchoice" value="${row.invoice_id}" class="form-check-input">
                  <i class="input-helper"></i></label>
                </div>
              `;
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

    function getProductItemByInvoice(invoiceId: string, callback: any) {
      const userLoggedJson = $.cookie('credentials') || sessionStorage.getItem('credentials');
      const userModel = $.parseJSON(userLoggedJson);

      const token = userModel.token;
      const tenant = userModel.tenant;

      const url = `http://178.128.123.223:8080/${tenant}/invoices/${invoiceId}`;
      $.ajax({
        url: url,
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
      })
        .done(function (data: any) {
          callback(data.items);
        })
        .fail(function (jqXHR: any, textStatus: any) {
          alert('Đã xảy ra lỗi: ' + textStatus);
        });
    }

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

    function formatEinvoiceRow(items: any) {
      let contentItemHtml = ``;
      if (items && items.length > 0) {
        let lineItem = ``;
        items.forEach(function (entry: any) {
          let priceFormat = entry.price;
          if (priceFormat > 0) {
            priceFormat = formatCurrency(priceFormat);
          }

          let taxFormat = entry.tax;
          if (taxFormat > 0) {
            taxFormat = formatCurrency(taxFormat);
          }

          let priceWtFormat = entry.price_wt;
          if (priceWtFormat > 0) {
            priceWtFormat = formatCurrency(priceWtFormat);
          }

          let amountFormat = entry.amount;
          if (amountFormat > 0) {
            amountFormat = formatCurrency(amountFormat);
          }

          lineItem += `
            <tr>
              <td>${entry.item_line}</td>
              <td>${entry.item_code}</td>
              <td>${entry.item_name}</td>
              <td>${entry.unit}</td>
              <td class="text-right">${priceFormat}</td>
              <td class="text-right">${taxFormat}</td>
              <td class="text-right">${priceWtFormat}</td>
              <td class="text-right">${entry.quantity}</td>
              <td class="text-right">${amountFormat}</td>
            </tr>
          `;
        });

        contentItemHtml =
          `<table class="table display dataTable">
          <thead>
            <tr>
              <th>Dòng</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Đơn vị</th>
              <th class="text-right">Giá</th>
              <th class="text-right">Thuế</th>
              <th class="text-right">% Thuế</th>
              <th class="text-right">price_wt</th>
              <th class="text-right">quantity</th>
              <th class="text-right">amount</th>
            </tr>
          </thead>
          <tbody>` +
          lineItem +
          `</tbody>
        </table>`;
      } else {
        contentItemHtml = `<p class="no-information">Không có thông tin</p>`;
      }

      return (
        `
      <fieldset class="scheduler-border border_customer">
        <legend class="scheduler-border">Thông tin sản phẩm</legend>
        ` +
        contentItemHtml +
        `</fieldset>`
      );
    }

    // disabled all button
    bindButtonStatus(true);

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

    // Add event listener for opening and closing details
    $('#invoiceTable tbody').on('click', 'td.details-control', function (e: any) {
      e.preventDefault();
      console.log('click td');
      const tr = $(this).closest('tr');
      const row = table.row(tr);

      console.log(tr.classList);

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('tr-expand');
      } else {
        // reset all
        const otherTr = $('tr.tr-expand');
        const otherRow = table.row(otherTr);
        otherTr.removeClass('tr-expand');
        otherRow.child.hide();

        // call API
        getProductItemByInvoice(row.data().invoice_id, function (items: any) {
          row.child(formatEinvoiceRow(items)).show();
          tr.addClass('tr-expand');
        });
      }
      return false;
    });
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
