import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { InvoiceService } from '@app/_services';
import { InvoiceParam, InvoiceListData } from '@app/_models';

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

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private invoiceService: InvoiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log('init');
    this.initDefault();
    this.initDataTable();
    this.initForm();
    this.initPageHandlerInRouter();
  }

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'f') {
  //     this.expandSearchClicked();
  //   }
  //   if (event.key === 'Enter' && this.expandSearch === true) {
  //     this.onSubmit(this.searchForm.value);
  //   }
  // }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('expandSearch', JSON.stringify(this.expandSearch));
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
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public copyRowClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public printRowClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public printTransformRowClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public signClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public approveClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public receiveExcelClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
  }

  public disposeClicked(){
    const item = this.getCheckboxesValue();
    console.log('item: ' + item);
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
    this.invoiceService.queryInvoices(params).subscribe(data => {
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
        { data: 'total_tax' },
        { data: 'total_tax' },
        { data: 'total' },
        {
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
      const token = 'abcxyz';
      const url = `http://178.128.123.223:8080/1/invoices/${invoiceId}`;
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

    function formatEinvoiceRow(items: any) {
      let contentItemHtml = ``;
      if (items && items.length > 0) {
        let lineItem = ``;
        items.forEach(function (entry: any) {
          lineItem += `
            <tr>
              <td>${entry.item_line}</td>
              <td>${entry.item_code}</td>
              <td>${entry.item_name}</td>
              <td>${entry.unit}</td>
              <td class="text-right">${entry.price}</td>
              <td class="text-right">${entry.tax}</td>
              <td class="text-right">${entry.price_wt}</td>
              <td class="text-right">${entry.quantity}</td>
              <td class="text-right">${entry.amount}</td>
            </tr>
          `;
        });

        contentItemHtml =
          `<table class="table table-responsive">
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
    $('#openButton').prop('disabled', true);
    $('#copyButton').prop('disabled', true);
    $('#printButton').prop('disabled', true);
    $('#printTranformButton').prop('disabled', true);
    $('#signButton').prop('disabled', true);
    $('#approveButton').prop('disabled', true);
    $('#disposeButton').prop('disabled', true);

    // selected row
    $('#invoiceTable tbody').on('click', 'tr', function () {
      $('input:checkbox[name=stickchoice]').each(function () {
        $(this).prop('checked', false);
      });

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this).find('input:checkbox[name=stickchoice]').prop('checked', false);

        $('#openButton').prop('disabled', true);
        $('#copyButton').prop('disabled', true);
        $('#printButton').prop('disabled', true);
        $('#printTranformButton').prop('disabled', true);
        $('#signButton').prop('disabled', true);
        $('#approveButton').prop('disabled', true);
        $('#disposeButton').prop('disabled', true);
      }
      else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input:checkbox[name=stickchoice]').prop('checked', true);

        // enable button
        $('#openButton').prop('disabled', false);
        $('#copyButton').prop('disabled', false);
        $('#printButton').prop('disabled', false);
        $('#printTranformButton').prop('disabled', false);
        $('#signButton').prop('disabled', false);
        $('#approveButton').prop('disabled', false);
        $('#disposeButton').prop('disabled', false);
      }
    });

    // $('#button').click(function () {
    //   table.row('.selected').remove().draw(false);
    // });

    // Add event listener for opening and closing details
    $('#invoiceTable tbody').on('click', 'td.details-control', function () {
      const tr = $(this).closest('tr');

      const row = table.row(tr);

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('tr-expand');
      } else {
        // call API
        getProductItemByInvoice(row.data().invoice_id, function (items: any) {
          row.child(formatEinvoiceRow(items)).show();
          tr.addClass('tr-expand');
        });
      }
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
