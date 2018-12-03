import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductFormComponent } from './components/form.component';
import * as moment from 'moment';
import { GoodService } from '@app/_services';
import { GoodParam, ProductModel } from '@app/_models';

declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, AfterViewInit {
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
    private productService: GoodService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.initDefault();
    this.initDataTable();
    this.initForm();
    this.initPageHandlerInRouter();
  }

  ngAfterViewInit() {
    this.initSelectBox();
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('productsearch', JSON.stringify(this.expandSearch));
  }

  public onSubmit(form: any) {}

  public addNewClicked() {
    this.modalRef = this.modalService.show(ProductFormComponent, { class: 'modal-lg' });
  }

  public editClicked() {}

  public deleteClicked() {}

  public copyClicked() {}

  public onPageChange(page: number) {}

  public deleteRow() {}

  public editRow() {}

  private getCheckboxesValue() {
    const itemsChecked = new Array<string>();
    $('input:checkbox[name=stickchoice]:checked').each(function() {
      const item: string = $(this).val();
      itemsChecked.push(item);
    });
    return itemsChecked;
  }

  private initPageHandlerInRouter() {
    this.callServiceAndBindTable();
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('productsearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
  }

  private initSelectBox() {
    $('select').select2({ minimumResultsForSearch: Infinity });
  }

  private callServiceAndBindTable() {
    this.productService.getList().subscribe(data => {
      if (data) {
        const goodList = data as Array<ProductModel>;
        this.totalElements = goodList.length;
        this.totalPages = goodList.length / 20;
        this.totalItems = goodList.length;

        $('#productTable')
          .dataTable()
          .fnClearTable();
        $('#productTable')
          .dataTable()
          .fnAddData(goodList);
      }
    });
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      code: '',
      name: '',
      group: '',
      unit: ''
    });
  }

  private initDataTable() {
    const $data_table = $('#productTable');
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
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: ''
        },
        {
          data: 'goods_code'
        },
        {
          data: 'goods_name'
        },
        {
          data: 'unit'
        },
        {
          data: 'price'
        },
        {
          data: 'tax_rate'
        },
        {
          data: 'goods_group'
        },
        {
          data: function(row: any, type: any) {
            if (type === 'display' && row.insert_date && row.insert_date !== 'null') {
              const dateFormate = moment(row.insert_date).format('DD/MM/YYYY');
              return `<span>${dateFormate}</span>`;
            } else {
              return '<span></span>';
            }
          }
        }
      ],
      select: {
        style: 'multi'
      },
      order: [[2, 'desc']],
      drawCallback: function() {
        const pagination = $(this)
          .closest('.dataTables_wrapper')
          .find('.dataTables_paginate');
        pagination.toggle(this.api().page.info().pages > 1);
      }
    });
  }
}
