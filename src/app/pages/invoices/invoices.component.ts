import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from './../../app.config';
import { APIService } from './../../services/api.service';
import { InvoiceParams } from '@app/app.interface';

declare var $: any;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit, AfterViewInit {
  private searchForm: FormGroup;

  constructor(
    private appConfig: AppConfig,
    private apiService: APIService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildSearchForm();
    this.initSelectBox();
    this.loadData();
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  private initSelectBox() {
    $('select').select2({ minimumResultsForSearch: Infinity });
  }

  private loadData() {
    this.apiService.getInvoices().subscribe(response => {
      if (response && response.contents.length > 0) {
        this.initDataTable(response.contents);
      }

    });
  }

  private buildSearchForm() {
    this.searchForm = this.formBuilder.group({
      sort: '',
      sortBy: '',
      size: '',
      page: '',
      fromDate: '',
      toDate: '',
      invoiceNo: '',
      form: '',
      serial: '',
      orgTaxCode: ''
    });

    // (<FormGroup>this.searchForm)
    //   .setValue({
    //     sortBy: 'invoiceNo',
    //     sort: 'ASC'
    //   }, { onlySelf: true });
  }


  private onSubmit(form: any) {
    console.log(JSON.stringify(form));
  }


  private initDataTable(results?: any) {
    const $data_table = $('#invoiceTable');
    const table = $data_table.DataTable({
      data: results,
      searching: false,
      serverSide: false,
      bLengthChange: false,
      info: false,
      scrollX: true,
      conditionalPaging: {
        style: 'fade',
        speed: 500
      },
      lengthMenu: [
        [20, 50, 100],
        [20, 50, 100]
      ],
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
      columnDefs: [{
        width: '30px',
        targets: 0,
        orderable: false
      }, {
        width: '80px',
        targets: 1,
        render: function (data: any) {
          return '<label class="badge badge-info">' + data + '</label>';
        }
      },
      { width: '50px', targets: 2 },
      { width: '120px', targets: 3 },
      { width: '120px', targets: 4 },
      {
        width: '120px',
        targets: 5
      },
      {
        width: '120px',
        targets: 6
      },
      {
        width: '70px',
        targets: 7
      },
      {
        width: '70px',
        targets: 8
      }, {
        width: '70px',
        targets: 9
      }, {
        width: '0px',
        targets: 10,
        visible: false
      }
      ],
      columns: [{
        className: 'details-control',
        orderable: false,
        data: null,
        defaultContent: ''
      },
      { data: 'invoice_no' },
      { data: 'form' },
      { data: 'serial' },
      { data: 'invoice_date' },
      {
        data: function (row: any, type: any) {
          if (type === 'display' && row.seller && row.seller !== 'null') {
            return row.seller.name;
          } else {
            return '';
          }
        }
      }, {
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
      { data: 'total' },
      { data: 'invoice_id' }
      ],
      drawCallback: function () {
        const pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });

    table.on('order.dt search.dt', function () {
      table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell: any, i: any) {
        cell.innerHTML = i + 1;
      });
    }).draw();

    function formatEinvoiceRow(d: any) {
      return `
      <fieldset class="scheduler-border">
        <legend class="scheduler-border">Thông tin khách hàng</legend>
        <table class="table table-bordered fixed-table-width">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Công ty</th> 
              <th>Mã số thuế</th>
              <th>Tài khoản</th>
              <th>Ngân hàng</th>
              <th>Địa chỉ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>` + d.customer.customer_name + `</td>
              <td>` + d.customer.phone + `</td>
              <td>` + d.customer.address + `</td>
              <td>` + d.customer.org + `</td>
              <td>` + d.customer.tax_code + `</td>
              <td>` + d.customer.bank_account + `</td>
              <td>` + d.customer.bank + `</td>
              <td>` + d.customer.email + `</td>
            </tr>
          </tbody>
        </table>
        </fieldset>
        <br />
      <fieldset class="scheduler-border">
        <legend class="scheduler-border">Thông tin người bán</legend>
        <table class="table table-bordered fixed-table-width">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th> Email</th>
              <th>Mã số thuế</th>
              <th>Tài khoản</th>
              <th>Ngân hàng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>` + d.seller.name + `</td>
              <td>` + d.seller.address + `</td>
              <td>` + d.seller.phone + `</td>
              <td>` + d.seller.email + `</td>
              <td>` + d.seller.tax_code + `</td>
              <td>` + d.seller.bank_account + `</td>
              <td>` + d.seller.bank + `</td>
            </tr>
          </tbody>
        </table>
        </fieldset>
      `;
    }
    // Add event listener for opening and closing details
    $('#invoiceTable tbody').on('click', 'td.details-control', function () {
      const tr = $(this).closest('tr');
      const row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(formatEinvoiceRow(row.data())).show();
        tr.addClass('shown');
      }
    });
  }
}
