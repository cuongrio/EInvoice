import { Component, OnInit, ChangeDetectorRef, TemplateRef, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductFormComponent } from './components/form.component';
import { GoodService } from '@app/_services';
import { AlertComponent } from '@app/shared/alert/alert.component';
import { GoodParam } from './../../_models/param/good.param';
import { ProductImportExcelComponent } from './components/import-excel.component';
import { PagingData } from '@app/_models/data/paging.data';
import { ProductModel } from '@app/_models';

declare var $: any;
type ArrayObject = Array<{ code: string; value: string }>;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' }; 
  @ViewChild('trashconfirm')
  private trashconfirm : TemplateRef<any>
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
  public modalRef: BsModalRef;
  public pageSizeList = new Array<any>();
  public sizeNumber: any;
  public sortArr: ArrayObject = [
    { value: 'Tăng dần', code: 'ASC' },
    { value: 'Giảm dần', code: 'DESC' }
  ];
  public sortByArr: ArrayObject = [
    { value: 'Mã hàng', code: 'goodsCode' }
  ];
  private previousPage = 0;
  constructor(
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private goodService: GoodService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initDefault();
    this.initDataTable();
    console.log(this.trashconfirm);
    let param: GoodParam = {
      page: 1,
      size: 20
    };
    this.initPageHandlerInRouter(param);
  }

  ngAfterViewInit(): void {
    var self = this;
    this.zone.run(() => {
      $('#productTable tbody').on('click', 'button.editControl', function () {
        const tr = $(this).closest('tr');
        const product: ProductModel = new ProductModel();
        product.goods_code = tr.find('.goods_code').html();
        product.goods_name = tr.find('.goods_name .lh-medium').attr('title');
        product.unit = tr.find('.unit').html();
        product.price = tr.find('.price').html();
        // format price
        if(product.price){
          const re = /\./gi;
          const result = product.price.replace(re, "");
          product.price = result;
        }
        product.tax_rate_code = tr.find('.tax_rate_code').html();
        product.tax_rate = tr.find('.tax_rate').html() ? tr.find('.tax_rate').html().replace("%",""): "";
        product.goods_group = tr.find('.goods_group').html();
        product.goods_id = tr.find('input:checkbox[name=stickchoice]').val(); 
        self.openPopupForUpdate(product);
      });

      $('#productTable tbody').on('click', 'button.trashControl', function () {
        const tr = $(this).closest('tr');
        const goods_id = tr.find('input:checkbox[name=stickchoice]').val(); 
        const goods_code = tr.find('.goods_code').html();
        console.log('goods_id: ' + goods_id);
        const initialState = {
          goods_id: goods_id,
          goods_code: goods_code
        };
        self.openModal(self.trashconfirm, initialState);
      });
    });
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('productsearch', JSON.stringify(this.expandSearch));
  }

  public showImportModal() {
    this.modalService.show(ProductImportExcelComponent, {
      animated: false, class: 'modal-md'
    });
  }

  public openModal(template: TemplateRef<any>, initialState: any) {
    console.log('init: ' + JSON.stringify(initialState));
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-sm', initialState});
  }

  public onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;
      const goodQuery = localStorage.getItem('goodQuery');
      let goodParam: GoodParam;
      if (goodQuery) {
        goodParam = JSON.parse(goodQuery);
      } else {
        goodParam = {};
      }

      goodParam.page = +this.page;
      goodParam.size = this.pageSizeList[0].code;

      $('#openButton').prop('disabled', true);
      localStorage.setItem('goodQuery', JSON.stringify(goodParam));
      // call service
      this.router.navigate([], { replaceUrl: true, queryParams: goodParam });
      this.callServiceAndBindTable(goodParam);
    }
  }

  public onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const goodParam: GoodParam = this.formatForm(form);
    goodParam.page = +this.page;
    goodParam.size = +this.sizeNumber;
    localStorage.setItem('goodQuery', JSON.stringify(goodParam));
    this.router.navigate([], { replaceUrl: true, queryParams: goodParam });
    $('#openButton').prop('disabled', true);
    this.callServiceAndBindTable(goodParam);
  }

  public addNewClicked() {
    this.modalService.show(ProductFormComponent, { animated: false, class: 'modal-lg' });
  }

  public resetForm() {

  }

  public downloadExcel() {
    this.goodService.downloadFile().subscribe(data => {
      const file = new Blob([data], { type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, err => {
      this.errorHandler(err);
    });
  }

  public onSizeChange(sizeObj: any) {
    let size = 20;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const userquery = localStorage.getItem('prdQuery');
    let param: GoodParam;
    if (userquery) {
      param = JSON.parse(userquery);
    } else {
      param = {};
    }
    param.page = 1;
    param.size = size;

    localStorage.setItem('prdQuery', JSON.stringify(param));
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: param });
    this.callServiceAndBindTable(param);

    $('#productTable').DataTable().page.len(size).draw();
  }

  private formatForm(form: any) {
    const goodParamsForamat: GoodParam = {};
    if (form.sort) {
      goodParamsForamat.sort = form.sort;
    }
    if (form.sortBy) {
      goodParamsForamat.sortBy = form.sortBy;
    }
    if (form.goodsCode && form.goodsCode.length > 0) {
      goodParamsForamat.goodsCode = form.goodsCode.trim();
    }

    return goodParamsForamat;
  }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Something went wrong',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error) {
      initialState.message = err.error.message;
    }
    this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
  }

  private initPageHandlerInRouter(goodParam: GoodParam) {
    this.callServiceAndBindTable(goodParam);
  }

  private openPopupForUpdate(product: ProductModel) {
    const initialState = {
      dataForm: product
    };
    this.modalService.show(ProductFormComponent, { animated: false, class: 'modal-md', initialState });
  }

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('productsearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
    this.pageSizeList = this.dummyPageSize();
    this.sizeNumber = 20;
  }

  private callServiceAndBindTable(param: GoodParam) {
    this.router.navigate([], { replaceUrl: true, queryParams: param });
    this.isSearching = true;
    this.goodService.queryGoods(param).subscribe(data => {
      if (data) {
        const list = data as PagingData;
        if (list.contents.length > 0) {
          this.totalElements = list.total_elements;
          this.totalPages = list.total_pages;
          this.totalItems = list.total_pages * this.itemsPerPage;

          $('#productTable')
            .dataTable()
            .fnClearTable();
          $('#productTable')
            .dataTable()
            .fnAddData(list.contents);
        } else {
          this.totalElements = 0;
          this.totalPages = 0;
          this.totalItems = 0;
          $('#productTable')
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

  private initForm() {
    this.searchForm = this.formBuilder.group({
      goodsCode: '',
      sort: '',
      sortBy: ''
    });
    this.searchForm.patchValue({
      sort: 'ASC',
      sortBy: 'goodsCode'
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
      createdRow: function (row: any, data: any, index: number) {
        $(row).addClass('row-parent');
      },
      columnDefs: [{
        width: '2%',
        searchable: false,
        orderable: false,
        "class": "index",
        targets: 0
      }, {  // ma hang
        width: '8%',
        targets: 1,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
          }
        }
      }, { // ten hang
        width: '55%',
        targets: 2,
        orderable: false,
      }, { // don vi tinh
        width: '5%',
        targets: 3,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            $(td).html(cellData);
          }
        }
      }, { // gia ban
        width: '8%',
        targets: 4,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const cellformat = formatCurrency(cellData);
            $(td).html(cellformat);
          }
        }
      }, { // %VAT
        width: '5%',
        targets: 5
      }, { // %VAT
        width: '4%',
        targets: 6,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData >= 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            $(td).html(cellData + '%');
          } else {
            $(td).attr('data-order', '0');
            $(td).attr('data-sort', '0');
            $(td).html('0%');
          }
        }
      }, { // Nhom
        width: '8%',
        targets: 7,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            $(td).html(cellData);
          }
        }
      }, {
        width: '5%',
        targets: 8,
        orderable: false,
        createdCell: function (td: any, cellData: string) {
          const htmlButton = `
          <div class="btn-group" role="group">
          <button class="editControl btn btn-md btn-link btn-icons pd-3"><i class="fa fa-edit"></i></button>
          <button class="trashControl btn btn-md btn-link btn-icons pd-3"><i class="fa fa-trash text-red"></i></button>
          </div>
          `;

          $(td).html(htmlButton);
        }
      }],
      columns: [{
        className: 'text-bold',
        data: 'tax_rate'
      }, {
        className: 'goods_code text-bold',
        data: 'goods_code'
      }, {
        className: 'goods_name cbox',
        data: function (row: any, type: any) {
          if (type === 'display'
            && row.goods_name) {
            const org: string = row.goods_name;
            let orgFormat: string;
            if (org.length <= 120) {
              orgFormat = org;
            } else {
              orgFormat = org.substring(0, 120);
              const lastWordIndex = orgFormat.lastIndexOf(' ');
              orgFormat = orgFormat.substring(0, lastWordIndex) + '...';
            }
            return `
              <span class="lh-medium" title="${org}">${orgFormat}</span>
              <div class="hidden-col">
              <input type="checkbox" name="stickchoice" value="${row.goods_id}">
              </div>
            `;
          } else {
            return '';
          }
        }
      }, {
        className: 'unit text-right',
        data: 'unit'
      }, {
        className: 'price text-right',
        data: 'price'
      }, {
        className: 'tax_rate_code hidden',
        data: 'tax_rate_code'
      }, {
        className: 'tax_rate text-right',
        data: 'tax_rate'
      }, {
        className: 'goods_group text-right',
        data: 'goods_group'
      }, {
        className: 'goods_id text-right',
        data: 'goods_id'
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

    function formatCurrency(price: number) {
      if (price > 0) {
        return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      }
      return price;
    }

    // disabled all button
    $('#editButton').prop('disabled', true);
    $('#copyButton').prop('disabled', true);
    $('#deleteButton').prop('disabled', true);

    // selected row
    $('#productTable tbody').on('click', 'tr.row-parent', function () {
      $('input:checkbox[name=stickchoice]').each(function () {
        $(this).prop('checked', false);
      });

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', false);

        $('#editButton').prop('disabled', true);
        $('#copyButton').prop('disabled', true);
        $('#deleteButton').prop('disabled', true);
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this)
          .find('input:checkbox[name=stickchoice]')
          .prop('checked', true);

        $('#editButton').prop('disabled', false);
        $('#copyButton').prop('disabled', false);
        $('#deleteButton').prop('disabled', false);
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
