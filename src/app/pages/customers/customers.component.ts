import { Component, OnInit, AfterViewInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CustomerFormComponent } from './components/form.component';
import { CustomerService } from './../../_services/app/customer.service';
import { PagingData, CustomerParam } from '@app/_models';
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
    this.initPageHandlerInRouter();
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

      const row = $('#customerTable tbody').find('tr.selected')[0];
      let customerText = '';
      $(row).find('td').each(function (index: any) {
        const tdText = $(this).text();
        if (index > 0 && tdText && tdText.trim().length > 0) {
          customerText += ',';
        }
        customerText += tdText;
      });
      copyToClipboard(customerText);

      setTimeout(function () {
        $('#copyLoading').hide();
        $('#copyLoaded').show();
      }, 500);
    });
  }

  public onSubmit(form: any) {

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

  public openClicked() {
    // const customerId = +this.getCheckboxesValue();
    // this.customerService.retrieveById(customerId).subscribe(data => {
    //   const initialState = {
    //     dataForm: data,
    //     viewMode: true
    //   };
    //   this.modalRef = this.modalService.show(CustomerFormComponent, { animated: false, class: 'modal-lg', initialState });
    // });

  }

  public openModal(template: TemplateRef<any>) {
    this.modalService.show(template, { animated: false, class: 'modal-sm' });
  }

  public onPageChange(page: number) { }

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

  private initPageHandlerInRouter() {
    this.callServiceAndBindTable(null);
  }

  private callServiceAndBindTable(param: CustomerParam) {
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
      this.router.navigate(['/500']);
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
      customer_code: '',
      customer_name: '',
      phone: '',
      tax_code: ''
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
        width: '10%',
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
              <input type="checkbox" name="stickchoice" value="${row.customer_id}" class="td-checkbox-hidden">
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

    function bindButtonStatus(status: boolean) {
      $('#editButton').prop('disabled', status);
      $('#copyButton').prop('disabled', status);
      $('#deleteButton').prop('disabled', status);
    }
    // disabled all button
    bindButtonStatus(true);

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
