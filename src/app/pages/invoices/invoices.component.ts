import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from './../../app.config';
import { APIService } from './../../services/api.service';
import { InvoiceParams } from '@app/app.interface';
import { TSImportEqualsDeclaration } from 'babel-types';
import { DatePipe } from '@angular/common';

declare var $: any;

type ArrayObject = Array<{ value: string; text: string }>;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit, AfterViewInit {
  public sortArr: string[] = ['ASC', 'DESC'];
  public sortByArr: ArrayObject = [
    { value: 'invoiceNo', text: 'Số hóa đơn' },
    { value: 'fromDate', text: 'Từ ngày' },
    { value: 'toDate', text: 'Đến ngày' },
    { value: 'serial', text: 'Số Serial' },
    { value: 'orgTaxCode', text: 'Mã số thuế' }
  ];

  // expand search
  public expandSearch: boolean;

  private searchForm: FormGroup;

  // pagination
  private itemsPerPage = 20;
  private totalItems = 0;
  private totalElements = 0;
  private page = 1;
  private previousPage = 0;
  private totalPages = 0;

  // select option

  private defaultSort = 'ASC';
  private defaultSortBy = 'invoiceNo';

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private apiService: APIService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initDefault();
    this.initDataTable();
    this.initForm();
    this.initSelectBox();
    this.initPageHandlerInRouter();
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    $('[data-toggle="tooltip"]').on('click', function () {
      $(this).tooltip('hide');
    });
    $('.details-control').removeClass('');
  }

  private initPageHandlerInRouter() {
    if (this.activeRouter.snapshot.queryParams) {
      const routerParams = JSON.parse(JSON.stringify(this.activeRouter.snapshot.queryParams));
      if (routerParams['page']) {
        this.page = +routerParams['page'];
        this.previousPage = +routerParams['page'];
      }

      // set default value form
      (<FormGroup>this.searchForm)
        .patchValue(routerParams, { onlySelf: true });
    }
    const invoiceParams: InvoiceParams = { page: JSON.stringify(this.page) };
    // call service
    this.callServiceAndBindTable(invoiceParams);
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('expandSearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
  }

  private initSelectBox() {
    $('select').select2({ minimumResultsForSearch: Infinity });
  }

  private onPageChange(page: number) {
    console.log(this.previousPage + '---' + page);
    if (this.previousPage !== page) {
      this.previousPage = page;
      const userquery = localStorage.getItem('userquery');
      let invoiceParams: InvoiceParams;
      if (userquery) {
        invoiceParams = JSON.parse(userquery);
      } else {
        invoiceParams = {};
      }

      invoiceParams.page = JSON.stringify(this.page);
      console.log('invoiceParams: ' + JSON.stringify(invoiceParams));

      // call service
      this.router.navigate([], { replaceUrl: true, queryParams: invoiceParams });
      this.callServiceAndBindTable(invoiceParams);
    }
  }

  private callServiceAndBindTable(params: InvoiceParams) {
    this.apiService.getInvoices(params).subscribe(response => {
      if (response && response.contents.length > 0) {
        this.totalElements = response.total_elements;
        this.totalPages = response.total_pages;
        this.totalItems = response.total_pages * this.itemsPerPage;

        $('#invoiceTable').dataTable().fnClearTable();
        $('#invoiceTable').dataTable().fnAddData(response.contents);
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

  private onSubmit(form: any) {
    this.page = 1;
    const invoiceParams: InvoiceParams = this.formatForm(form);
    invoiceParams.page = JSON.stringify(this.page);
    localStorage.setItem('userquery', JSON.stringify(invoiceParams));
    this.router.navigate([], { replaceUrl: true, queryParams: invoiceParams });
    this.callServiceAndBindTable(invoiceParams);
  }

  private expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('expandSearch', JSON.stringify(this.expandSearch));
  }

  private convertDateToString(myDate: any) {
    const convertedDate = myDate.year + '-' + myDate.month + '-' + myDate.day;
    return convertedDate;
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
        searchPlaceholder: 'Lọc trong danh sách...',
        sSearch: '',
        lengthMenu: 'Hiển thị  _MENU_ dòng/trang',
        info: 'Trang hiện tại _PAGE_/ _PAGES_',
        emptyTable: 'Không có dữ liệu',
        paginate: {
          previous: '<',
          next: '>',
          first: '<<',
          last: '>>'
        }
      },
      columnDefs: [
        {
          width: '30px',
          targets: 0,
          orderable: false
        },
        {
          width: '100px',
          targets: 1,
          render: function (data: any) {
            return '<label class="badge badge-info">' + data + '</label>';
          }
        },
        {
          width: '70px',
          targets: 5,
          render: function (data: any) {
            if (data && data !== 'null') {
              return '<span class="number-format">' + data + '</span>';
            } else {
              return '<span></span>';
            }
          }
        },
        {
          width: '70px',
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
          width: '70px',
          targets: 7,
          render: function (data: any) {
            if (data && data !== 'null') {
              return '<span class="number-format">' + data + '</span>';
            } else {
              return '<span></span>';
            }
          }
        }
      ],
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: ''
        },
        { data: 'invoice_no' },
        { data: 'invoice_date' },
        {
          data: function (row: any, type: any) {
            if (type === 'display' && row.seller && row.seller !== 'null') {
              return row.seller.name;
            } else {
              return '';
            }
          }
        },
        {
          data: function (row: any, type: any) {
            if (type === 'display' && row.customer && row.customer !== 'null') {
              return row.customer.customer_name;
            } else {
              return '';
            }
          }
        },
        { data: 'total_before_tax' },
        { data: 'total_tax' },
        { data: 'total' }
      ],
      order: [[2, 'desc']],
      drawCallback: function () {
        const pagination = $(this)
          .closest('.dataTables_wrapper')
          .find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });

    function formatEinvoiceRow(d: any) {
      let customerHtml = ``;
      if (d.customer) {
        const customerDom =
          `
          <table class="table table-responsive">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Công ty</th>
              <th>MST</th>
              <th>Tài khoản</th>
              <th>Ngân hàng</th>
              <th>Địa chỉ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>` +
          d.customer.customer_name +
          `</td>
              <td>` +
          d.customer.phone +
          `</td>
              <td>` +
          d.customer.address +
          `</td>
              <td>` +
          d.customer.org +
          `</td>
              <td>` +
          d.customer.tax_code +
          `</td>
              <td>` +
          d.customer.bank_account +
          `</td>
              <td>` +
          d.customer.bank +
          `</td>
              <td>` +
          d.customer.email +
          `</td>
            </tr>
          </tbody>
        </table>
      `;

        customerHtml = customerDom;
      } else {
        customerHtml = `<p class="no-information">Không có thông tin</p>`;
      }

      let sellerHtml = ``;
      if (d.seller) {
        const sellerDom =
          `
      <table class="table table-responsive">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Địa chỉ</th>
              <th>Phone</th>
              <th>Email</th>
              <th>MST</th>
              <th>Tài khoản</th>
              <th>Ngân hàng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>` +
          d.seller.name +
          `</td>
              <td>` +
          d.seller.address +
          `</td>
              <td>` +
          d.seller.phone +
          `</td>
              <td>` +
          d.seller.email +
          `</td>
              <td>` +
          d.seller.tax_code +
          `</td>
              <td>` +
          d.seller.bank_account +
          `</td>
              <td>` +
          d.seller.bank +
          `</td>
            </tr>
          </tbody>
        </table>
      `;
        sellerHtml = sellerDom;
      } else {
        sellerHtml = `<p class="no-information">Không có thông tin</p>`;
      }

      return (
        `
      <fieldset class="scheduler-border border_customer">
        <legend class="scheduler-border">1. Thông tin khách hàng</legend>
        ` +
        customerHtml +
        `
      </fieldset>
      <br />
      <fieldset class="scheduler-border border_seller">
        <legend class="scheduler-border">2. Thông tin người bán</legend>
        ` +
        sellerHtml +
        `
        </fieldset>
      `
      );
    }
    // Add event listener for opening and closing details
    $('#invoiceTable tbody').on('click', 'td.details-control', function () {
      const tr = $(this).closest('tr');

      const row = table.row(tr);

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('tr-expand');
      } else {
        row.child(formatEinvoiceRow(row.data())).show();
        tr.addClass('tr-expand');
      }
    });
  }

  private formatForm(form: any) {
    const invoiceParamsForamat: InvoiceParams = {};
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
      invoiceParamsForamat.fromDate = this.convertDateToString(form.fromDate);
    }
    if (form.toDate) {
      invoiceParamsForamat.toDate = this.convertDateToString(form.toDate);
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
