import { CONTENT_TYPE, DATE, ID, MSG, PAGE, SORT, STORE_KEY, INIT } from 'app/constant';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AfterViewInit, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PagingData } from '@model/data/paging.data';
import { CustomerParam } from '@model/param/customer.param';
import { GoodParam } from '@model/param/good.param';
import { CustomerService } from '@service/app/customer.service';
import { UtilsService } from '@service/index';
import { AlertComponent } from '@shared/alert/alert.component';

import { CustomerFormComponent } from './form.component';
import { CustomerImportExcelComponent } from './import-excel.component';

declare var $: any;
 
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit, AfterViewInit {

  bsConfig = DATE.bsConfig;

  viewMode = false;

  isSearching = false;
  // expand search
  expandSearch: boolean;
  searchForm: FormGroup;

  page = PAGE.firstPage;
  itemPerPage = PAGE.size;
 
  totalItems = 0;
  totalElements = 0;
  totalPages = 0;

  pageSizeList = new Array<any>(); 

  sortArr = INIT.sort;
  sortByArr = INIT.cSortBy;

  private previousPage = 0;
  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initDefault();
    this.createForm();
    this.initDataTable();

    let param: GoodParam = {
      size: PAGE.size,
      page: PAGE.firstPage
    };
    this.initRouter(param);
  }

  ngAfterViewInit(): void {
    $(`${ID.customerTable} tbody`).on('click', '.editControl', function () {
      // alert('edit control');
    });
  }

  onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;
      const cusQuery = this.utilsService.getKey(STORE_KEY.cusQ);

      let cusParam: CustomerParam;
      if (cusQuery) {
        cusParam = JSON.parse(cusQuery);
      } else {
        cusParam = {};
      }

      cusParam.page = +this.page; 

      $(ID.open).prop('disabled', true);
      this.utilsService.putKey(
        STORE_KEY.cusQ,
        cusParam
      );

      this.callServiceAndBindTable(cusParam);
    }
  }

  onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const cusParam: CustomerParam = this.formatForm(form);
    cusParam.page = +this.page;
    cusParam.size = +this.itemPerPage;

    this.utilsService.putKey(
      STORE_KEY.cusQ,
      cusParam
    );

    this.router.navigate([], {
      replaceUrl: true,
      queryParams: cusParam
    });

    $(ID.open).prop('disabled', true);
    this.callServiceAndBindTable(cusParam);
  }

  private formatForm(form: any) {
    const customerParamsForamat: CustomerParam = {};
    if (form.sort) {
      customerParamsForamat.sort = form.sort;
    }
    if (form.sortBy) {
      customerParamsForamat.sortBy = form.sortBy;
    }
    if (form.customer_code && form.customer_code.length > 0) {
      customerParamsForamat.customer_code = form.customer_code.trim();
    }
    if (form.taxCode && form.taxCode.length > 0) {
      customerParamsForamat.taxCode = form.taxCode.trim();
    }
    if (form.phone && form.phone.length > 0) {
      customerParamsForamat.phone = form.phone.trim();
    }
    if (form.email) {
      customerParamsForamat.email = form.email;
    }
    return customerParamsForamat;
  }

  showImportModal() {
    this.modalService.show(CustomerImportExcelComponent, {
      animated: false, class: 'modal-md'
    });
  }

  resetForm() {

  }

  onSizeChange(sizeObj: any) {
    let size = 20;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    let param: CustomerParam = {};

    const userQ = this.utilsService.getKey(STORE_KEY.userQ);
    if (userQ) {
      param = JSON.parse(userQ);
    } else {
      param = {};
    }
    param.page = 1;
    param.size = size;

    this.utilsService.putKey(
      STORE_KEY.cusQ,
      param
    );
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: param });
    this.callServiceAndBindTable(param);

    $(ID.customerTable).DataTable().page.len(size).draw();
  }

  expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }

    this.utilsService.putKey(
      STORE_KEY.cusE,
      this.expandSearch
    );

  }

  addNewClicked() {
    const initialState = {
      viewMode: false
    };
    this.modalService.show(
      CustomerFormComponent,
      { animated: false, class: 'modal-lg', initialState }
    );
  }

  editClicked() {
    alert('lcick');
  }

  downloadExcel() {
    this.customerService.downloadFile()
      .subscribe((data: any) => {
        const file = new Blob(
          [data],
          { type: CONTENT_TYPE.excel }
        );
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, (err: any) => {
        this.errorHandler(err);
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.show(template, { animated: false, class: 'modal-sm' });
  }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Something went wrong',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error && err.error.message) {
      initialState.message = err.error.message;
    }
    this.modalService.show(
      AlertComponent,
      { animated: false, class: 'modal-sm', initialState }
    );
  }

  private getCheckboxesValue() {
    const itemsChecked = new Array<string>();
    $(`${ID.stickyChoice}:checked`).each(function () {
      const item: string = $(this).val();
      itemsChecked.push(item);
    });
    return itemsChecked;
  }

  private initRouter(param: GoodParam) {
    this.callServiceAndBindTable(param);
  }

  private callServiceAndBindTable(param: CustomerParam) {
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: param });

    this.isSearching = true;
    this.customerService.queryCustomers(param)
      .subscribe((data: any) => {
        if (data) {
          const list = data as PagingData;
          if (list.contents.length > 0) {
            this.totalElements = list.total_elements;
            this.totalPages = list.total_pages;
            this.totalItems = list.total_pages * this.itemPerPage;

            $(ID.customerTable)
              .dataTable()
              .fnClearTable();
            $(ID.customerTable)
              .dataTable()
              .fnAddData(list.contents);
          } else {
            this.totalElements = 0;
            this.totalPages = 0;
            this.totalItems = 0;
            $(ID.customerTable)
              .dataTable()
              .fnClearTable();
          }
        }

        setTimeout(function () {
          this.isSearching = false;
          this.ref.markForCheck();
        }.bind(this), 200);

      }, (err: any) => {
        this.router.navigate(['/trang-500']);
      });
  }

  private initDefault() {
    const expand = this.utilsService.getKey(STORE_KEY.cusE)

    if (expand) {
      this.expandSearch = JSON.parse(expand);
    } else {
      this.expandSearch = false;
    }
    this.pageSizeList = PAGE.box;
    this.itemPerPage = PAGE.size;
  }

  private createForm() {
    this.searchForm = this.formBuilder.group({
      customer_code: '',
      email: '',
      phone: '',
      taxCode: '',
      sort: '',
      sortBy: ''
    });

    this.searchForm.patchValue({
      sort: SORT.asc,
      sortBy: SORT.cusCode
    });
  }

  private initDataTable() {
    const $data_table = $(ID.customerTable);
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
        emptyTable: MSG.empty
      },
      createdRow: function (row: any, data: any, index: number) {
        $(row).addClass('row-parent');
      },
      columnDefs: [{
        width: '2%',
        searchable: false,
        orderable: false,
        "class": "index",
        targets: 0
      }, {  // ma doi tuong
        width: '5%',
        targets: 1,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
          }
        }
      }, { // ten doi tuong
        width: '13%',
        targets: 2,
        orderable: false,
      }, { // dien thoai
        width: '5%',
        targets: 3,
        orderable: false,
      }, { // email
        width: '8%',
        targets: 4,
        orderable: false,
      }, { // cong ty
        width: '15%',
        targets: 5,
        orderable: false,
      }, { // ma so thue
        width: '10%',
        targets: 6,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            $(td).html(cellData);
          }
        }
      }, { // dia chi
        width: '20%',
        targets: 7,
        orderable: false,
      },
      { // tai khoan ngan hang
        width: '5%',
        targets: 8,
        orderable: false
      }, { // ngan hang
        width: '15%',
        targets: 9,
        orderable: false
      }, {
        width: '2%',
        targets: 10,
        orderable: false,
        createdCell: function (td: any, cellData: string) {
          const htmlButton = `
          <div class="btn-group" role="group">
          <a class="editControl pd-3" href="#"><i class="fa fa-edit"></i></a>
          <a class="trashControl pd-3" href="#"><i class="fa fa-trash text-red"></i></a>
          </div>
          `;

          $(td).html(htmlButton);
        }
      }],
      columns: [{
        className: 'text-bold',
        data: 'customer_id'
      }, {
        className: 'text-bold',
        data: 'customer_code'
      }, {
        className: 'cbox',
        data: function (row: any, type: any) {
          if (type === 'display'
            && row.customer_name) {
            return `
              <span>${row.customer_name}</span>
              <div class="hidden-col">
              <input type="checkbox" name="stickchoice" value="${row.customer_id}">
              </div>
            `;
          } else {
            return '';
          }
        }
      }, {
        data: 'phone'
      }, {
        data: 'email'
      }, {
        data: 'org'
      }, {
        data: 'tax_code'
      }, {
        data: 'address'
      }, {
        data: 'bank_account'
      }, {
        data: 'bank',
      }, {
        data: 'customer_id'
      }],
      select: {
        style: 'single',
        items: 'cells',
        info: false
      },
      order: [[1, 'desc']],
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

    // selected row
    $(`${ID.customerTable} tbody`).on('click', 'tr.row-parent',
      function () {
        $(ID.stickyChoice).each(function () {
          $(this).prop('checked', false);
        });

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
          $(this)
            .find(ID.stickyChoice)
            .prop('checked', false);
        } else {
          table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
          $(this)
            .find(ID.stickyChoice)
            .prop('checked', true);
        }
        return false;
      });
  }
}
