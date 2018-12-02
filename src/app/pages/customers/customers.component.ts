import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CustomerFormComponent } from './components/form.component';
import { CustomerService } from './../../_services/app/customer.service';
import { CustomerModel } from '@app/_models';

declare var $: any;

type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit, AfterViewInit {

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

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initDefault();
    this.initDataTable();
    this.initForm();
    this.initPageHandlerInRouter();
  }

  ngAfterViewInit() {
    this.initSelectBox();
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
    localStorage.setItem('customerSearch', JSON.stringify(this.expandSearch));
  }

  public onSubmit(form: any) {

  }

  public addNewClicked() {
    this.modalRef = this.modalService.show(CustomerFormComponent, { class: 'modal-lg' });
  }

  public editClicked() {

  }

  public deleteClicked() {

  }

  public copyClicked() {

  }

  public onPageChange(page: number) {

  }

  public deleteRow() {

  }

  public editRow() { }

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

  private initSelectBox() {
    $('select').select2({ minimumResultsForSearch: Infinity });
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      code: '',
      name: '',
      phone: '',
      taxCode: ''
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
        emptyTable: 'Không có dữ liệu',
      },
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: ''
        }, {
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
        }

      ],
      select: {
        style: 'multi'
      },
      order: [[2, 'desc']],
      drawCallback: function () {
        const pagination = $(this)
          .closest('.dataTables_wrapper')
          .find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });
  }
}
