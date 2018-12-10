import { Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CustomerFormComponent } from './components/form.component';
import { CustomerService } from './../../_services/app/customer.service';
import { CustomerModel } from '@app/_models';
import { AlertComponent } from '@app/shared/alert/alert.component';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit, AfterViewInit {
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public modalRef: BsModalRef;

  public viewMode = false;

  // expand search
  public expandSearch: boolean;
  public searchForm: FormGroup;
  public page = 1;
  // pagination
  public itemsPerPage = 20;
  public totalItems = 0;
  public totalElements = 0;
  public totalPages = 0;

  constructor(
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

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('customerSearch', JSON.stringify(this.expandSearch));
  }

  public addNewClicked() {
    const initialState = {
      viewMode: false
    };
    this.modalRef = this.modalService.show(CustomerFormComponent, { class: 'modal-lg', initialState });
  }

  public openClicked() {
    const customerId = +this.getCheckboxesValue();
    this.customerService.retrieveById(customerId).subscribe(data => {
      const initialState = {
        dataForm: data,
        viewMode: true
      };
      this.modalRef = this.modalService.show(CustomerFormComponent, { class: 'modal-lg', initialState });
    });

  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public deleteClicked() {
    const customerId = +this.getCheckboxesValue();
    this.customerService.delete(customerId).subscribe(
      data => {
        this.modalRef.hide();
        const initialState = {
          message: 'Đã hủy đối tượng thành công!',
          title: 'Thành công!',
          class: 'success',
          highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
      },
      err => {
        this.modalRef.hide();
        this.errorHandler(err);
      }
    );
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
    this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
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
    this.callServiceAndBindTable();
  }

  private callServiceAndBindTable() {
    this.customerService.getList().subscribe(data => {
      if (data) {
        const customerList = data as Array<CustomerModel>;
        this.totalElements = customerList.length;
        this.totalPages = customerList.length / 20;
        this.totalItems = customerList.length;

        $('#customerTable')
          .dataTable()
          .fnClearTable();
        $('#customerTable')
          .dataTable()
          .fnAddData(customerList);
      }
    });
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('customerSearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
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
      columnDefs: [
        {
          width: '60px',
          targets: 0,
          orderable: true
        }, {
          width: '100px',
          targets: 1,
          orderable: false
        }, {
          width: '200x',
          targets: 2
        }, {
          width: '100px',
          targets: 3
        }, {
          width: '100px',
          targets: 4
        }, {
          width: '100px',
          targets: 5
        }, {
          width: '100px',
          targets: 6
        }, {
          width: '100px',
          targets: 7,
          orderable: false
        }, {
          width: '20px',
          targets: 8,
          orderable: false
        }],
      columns: [
        {
          data: 'customer_code'
        }, {
          data: 'customer_name'
        }, {
          data: 'address'
        }, {
          data: 'phone'
        }, {
          data: 'email'
        }, {
          data: 'tax_code'
        }, {
          data: 'org'
        }, {
          data: 'bank_account'
        }, {
          data: 'bank'
        }, {
          orderable: false,
          data: function (row: any, type: any) {
            if (type === 'display' && row.customer_id && row.customer_id !== 'null') {
              return `
                <div class="form-check">
                  <label class="form-check-label">
                    <input type="checkbox" name="stickchoice" value="${row.customer_id}" class="form-check-input">
                  <i class="input-helper"></i></label>
                </div>
              `;
            } else {
              return '<span></span>';
            }
          }
        }
      ],
      drawCallback: function () {
        const pagination = $(this)
          .closest('.dataTables_wrapper')
          .find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });

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
}
