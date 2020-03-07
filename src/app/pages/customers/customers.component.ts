import { Component, OnInit, AfterViewInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CustomerFormComponent } from './components/form.component';
import { CustomerService } from './../../_services/app/customer.service';
import { PagingData, CustomerParam, GoodParam } from '@app/_models';
import { AlertComponent } from '@app/shared/alert/alert.component';
import { CustomerImportExcelComponent } from './components/import-excel.component';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit, AfterViewInit {

  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };

  public viewMode = false;

  public isSearching = false;
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


  public sortArr: ArrayObject = [
    { value: 'Tăng dần', code: 'ASC' },
    { value: 'Giảm dần', code: 'DESC' }
  ];
  public sortByArr: ArrayObject = [
    { value: 'Mã đối tượng', code: 'customerCode' },
    { value: 'Mã số thuế', code: 'taxCode' }
  ];

  private previousPage = 0;
  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initDefault();
    this.createForm();
    this.initDataTable();

    let param: GoodParam = {
      size: 20,
      page: 1
    };
    this.initPageHandlerInRouter(param);
  }

  ngAfterViewInit(): void {
    $('#customerTable tbody').on('click', '.editControl', function () {
      alert('edit control');
    });
  }

  public onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;
      const cusQuery = localStorage.getItem('cusQuery');
      let cusParam: CustomerParam;
      if (cusQuery) {
        cusParam = JSON.parse(cusQuery);
      } else {
        cusParam = {};
      }

      cusParam.page = +this.page;
      cusParam.size = this.pageSizeList[0].code;

      $('#openButton').prop('disabled', true);
      localStorage.setItem('cusQuery', JSON.stringify(cusParam));
     
      this.callServiceAndBindTable(cusParam);
    }
  }

  public onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const customerParam: CustomerParam = this.formatForm(form);
    customerParam.page = +this.page;
    customerParam.size = +this.sizeNumber;
    localStorage.setItem('cusQuery', JSON.stringify(customerParam));
    this.router.navigate([], { replaceUrl: true, queryParams: customerParam });
    $('#openButton').prop('disabled', true);
    this.callServiceAndBindTable(customerParam);
  }

  private formatForm(form: any) {
    const customerParamsForamat: CustomerParam = {};
    if (form.sort) {
      customerParamsForamat.sort = form.sort;
    }
    if (form.sortBy) {
      customerParamsForamat.sortBy = form.sortBy;
    }
    if (form.customerCode && form.customerCode.length > 0) {
      customerParamsForamat.customerCode = form.customerCode.trim();
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

  public showImportModal() {
    this.modalService.show(CustomerImportExcelComponent, {
      animated: false, class: 'modal-md'
    });
  }

  public resetForm() {

  }

  public onSizeChange(sizeObj: any) {
    let size = 20;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const userquery = localStorage.getItem('userquery');
    let param: CustomerParam;
    if (userquery) {
      param = JSON.parse(userquery);
    } else {
      param = {};
    }
    param.page = 1;
    param.size = size;

    localStorage.setItem('customerquery', JSON.stringify(param));
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: param });
    this.callServiceAndBindTable(param);

    $('#customerTable').DataTable().page.len(size).draw();
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('isCustomerExpand', JSON.stringify(this.expandSearch));
  }

  public addNewClicked() {
    const initialState = {
      viewMode: false
    };
    this.modalService.show(CustomerFormComponent, { animated: false, class: 'modal-lg', initialState });
  }

  public editClicked(){
    alert('lcick');
  }

  public downloadExcel() {
    this.customerService.downloadFile().subscribe(data => {
      const file = new Blob([data], { type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, err => {
      this.errorHandler(err);
    });
  }

  public openModal(template: TemplateRef<any>) {
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
    this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
  }

  private getCheckboxesValue() {
    const itemsChecked = new Array<string>();
    $('input:checkbox[name=stickchoice]:checked').each(function () {
      const item: string = $(this).val();
      itemsChecked.push(item);
    });
    return itemsChecked;
  }

  private initPageHandlerInRouter(param: GoodParam) {
    this.callServiceAndBindTable(param);
  }

  private callServiceAndBindTable(param: CustomerParam) {
     // call service
     this.router.navigate([], { replaceUrl: true, queryParams: param });

    this.isSearching = true;
    this.customerService.queryCustomers(param).subscribe(data => {
      if (data) {
        const list = data as PagingData;
        if (list.contents.length > 0) {
          this.totalElements = list.total_elements;
          this.totalPages = list.total_pages;
          this.totalItems = list.total_pages * this.itemsPerPage;

          $('#customerTable')
            .dataTable()
            .fnClearTable();
          $('#customerTable')
            .dataTable()
            .fnAddData(list.contents);
        } else {
          this.totalElements = 0;
          this.totalPages = 0;
          this.totalItems = 0;
          $('#customerTable')
            .dataTable()
            .fnClearTable();
        }
      }

      setTimeout(function () {
        this.isSearching = false;
        this.ref.markForCheck();
      }.bind(this), 200);

    }, err => {
      this.router.navigate(['/trang-500']);
    });
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('isCustomerExpand');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
    this.pageSizeList = this.dummyPageSize();
    this.sizeNumber = 20;
  }

  private createForm() {
    this.searchForm = this.formBuilder.group({
      customerCode: '',
      email: '',
      phone: '',
      taxCode: '',
      sort: '',
      sortBy: ''
    });

    this.searchForm.patchValue({
      sort: 'ASC',
      sortBy: 'customerCode'
    });
  }

  private initDataTable() {
    const $data_table = $('#customerTable');
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
    $('#customerTable tbody').on('click', 'tr.row-parent', function () {
      $('input:checkbox[name=stickchoice]').each(function () {
        $(this).prop('checked', false);
      });

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', false);
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', true);
      }
      return false;
    });
  }

  public dummyPageSize() {
    return [{
      code: 20,
      value: '20'
    }, {
      code: 50,
      value: '50'
    }, {
      code: 100,
      value: '100'
    }];
  }
}
