import { CONTENT_TYPE, DATE, ID, INIT, MSG, PAGE, SORT, STORE_KEY } from 'app/constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AfterViewInit, Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GoodParam, PagingData, ProductModel } from '@model/index';
import { GoodService, UtilsService } from '@service/index';
import { AlertComponent } from '@shared/alert/alert.component';

import { ProductFormComponent } from './form.component';
import { ProductImportExcelComponent } from './import-excel.component';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit, AfterViewInit {
  bsConfig = DATE.bsConfig;

  isSearching = false;

  sortArr = INIT.sort;
  sortByArr = INIT.gSortBy;

  // expand search
  expandSearch: boolean;
  searchForm: FormGroup;

  page = PAGE.firstPage;
  itemPerPage = PAGE.size;

  // pagination 
  totalItems = 0;
  totalElements = 0;
  totalPages = 0;
  modalRef: BsModalRef;
  pageSizeList = new Array<any>();


  @ViewChild('trashconfirm')
  private trashconfirm: TemplateRef<any>

  private previousPage = 0;
  constructor(
    private zone: NgZone,
    private router: Router,
    private utilsService: UtilsService,
    private goodService: GoodService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initDefault();
    this.initDataTable();
    let param: GoodParam = {
      page: PAGE.firstPage,
      size: PAGE.size
    };
    this.initPageHandlerInRouter(param);
  }

  ngAfterViewInit(): void {
    var self = this;
    this.zone.run(() => {
      $(`${ID.productTable} tbody`).on('click', 'button.editControl', function () {
        const tr = $(this).closest('tr');
        const product: ProductModel = new ProductModel();
        product.goods_code = tr.find('.goods_code').html();
        product.goods_name = tr.find('.goods_name .cbox').attr('title');
        product.unit = tr.find('.unit').html();
        product.price = tr.find('.price').html();
        // format price
        if (product.price) {
          const re = /\./gi;
          const result = product.price.replace(re, "");
          product.price = result;
        }
        product.tax_rate_code = tr.find('.tax_rate_code').html();
        product.tax_rate =
          tr.find('.tax_rate').html() ? tr.find('.tax_rate').html().replace("%", "") : "";
        product.goods_group = tr.find('.goods_group').html();
        product.goods_id = tr.find(ID.stickyChoice).val();
        self.openPopupForUpdate(product);
      });

      $(`${ID.productTable} tbody`).on(
        'click',
        'button.trashControl',
        function () {
          const tr = $(this).closest('tr');
          const goods_id = tr.find(ID.stickyChoice).val();
          const goods_code = tr.find('.goods_code').html();
          const initialState = {
            goods_id: goods_id,
            goods_code: goods_code
          };
          self.openModal(self.trashconfirm, initialState);
        });
    });
  }

  expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }

    this.utilsService.putKey(
      STORE_KEY.gE,
      this.expandSearch
    );
  }

  showImportModal() {
    this.modalService.show(
      ProductImportExcelComponent, {
      animated: false, class: 'modal-md'
    });
  }

  openModal(
    template: TemplateRef<any>,
    initialState: any
  ) {

    this.modalRef = this.modalService.show(
      template, {
      animated: false,
      class: 'modal-sm',
      initialState
    });
  }

  onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;

      const gQ = this.utilsService.getKey(STORE_KEY.gQ);
      let goodParam: GoodParam;
      if (gQ) {
        goodParam = JSON.parse(gQ);
      } else {
        goodParam = {};
      }

      goodParam.page = +this.page; 

      $(ID.open).prop('disabled', true);
      this.utilsService.putKey(
        STORE_KEY.gQ,
        goodParam
      );

      // call service
      this.router.navigate([], {
        replaceUrl: true,
        queryParams: goodParam
      });
      this.callServiceAndBindTable(goodParam);
    }
  }

  onSubmit(form: any) {
    this.page = PAGE.firstPage;
    this.isSearching = true;

    const goodParam: GoodParam = this.formatForm(form);
    goodParam.page = +this.page;
    goodParam.size = +this.itemPerPage;

    this.utilsService.putKey(
      STORE_KEY.gQ,
      goodParam
    );
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: goodParam
    });

    $(ID.open).prop('disabled', true);
    this.callServiceAndBindTable(goodParam);
  }

  addNewClicked() {
    this.modalService.show(
      ProductFormComponent, {
      animated: false,
      class: 'modal-lg'
    });
  }

  resetForm() {

  }

  downloadExcel() {
    this.goodService.downloadFile()
      .subscribe((data: any) => {
        const file = new Blob(
          [data], {
          type: CONTENT_TYPE.excel
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, (err: any) => {
        this.errorHandler(err);
      });
  }

  onSizeChange(sizeObj: any) {
    let size = PAGE.size;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const gQ = this.utilsService.getKey(STORE_KEY.gQ);
    let param: GoodParam;
    if (gQ) {
      param = JSON.parse(gQ);
    } else {
      param = {};
    }
    param.page = 1;
    param.size = size;

    this.utilsService.putKey(
      STORE_KEY.gQ,
      param
    );

    // call service
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: param
    });

    this.callServiceAndBindTable(param);

    $(ID.productTable).DataTable().page.len(size).draw();
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
    this.modalService.show(
      AlertComponent, {
      animated: false,
      class: 'modal-sm',
      initialState
    });
  }

  private initPageHandlerInRouter(goodParam: GoodParam) {
    this.callServiceAndBindTable(goodParam);
  }

  private openPopupForUpdate(product: ProductModel) {
    const initialState = {
      dataForm: product
    };
    this.modalService.show(
      ProductFormComponent, {
      animated: false,
      class: 'modal-md',
      initialState
    });
  }

  private initDefault() {
    const gQ = this.utilsService.getKey(STORE_KEY.gQ);

    if (gQ) {
      this.expandSearch = JSON.parse(gQ);
    } else {
      this.expandSearch = false;
    }
    this.pageSizeList = PAGE.box;
    this.itemPerPage = PAGE.size;
  }

  private callServiceAndBindTable(param: GoodParam) {
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: param
    });

    this.isSearching = true;
    this.goodService.queryGoods(param)
      .subscribe((data: any) => {
        if (data) {
          const list = data as PagingData;
          if (list.contents.length > 0) {
            this.totalElements = list.total_elements;
            this.totalPages = list.total_pages;
            this.totalItems = list.total_pages * PAGE.size;

            $(ID.productTable)
              .dataTable()
              .fnClearTable();
            $(ID.productTable)
              .dataTable()
              .fnAddData(list.contents);
          } else {
            this.totalElements = 0;
            this.totalPages = 0;
            this.totalItems = 0;
            $(ID.productTable)
              .dataTable()
              .fnClearTable();
          }
        }

        setTimeout(function () {
          this.isSearching = false;
        }.bind(this), 200);

      }, () => {
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
      sort: SORT.asc,
      sortBy: SORT.gCode
    });
  }

  private initDataTable() {
    const $data_table = $(ID.productTable);
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
      createdRow: function (row: any) {
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
              <span title="${org}">${orgFormat}</span>
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
      table.column(0, {
        search: 'applied',
        order: 'applied'
      }).nodes()
        .each(function (cell: any, i: number) {
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
    $(ID.edit).prop('disabled', true);
    $(ID.copy).prop('disabled', true);
    $(ID.delete).prop('disabled', true);

    // selected row
    $(`${ID.productTable} tbody`).on('click', 'tr.row-parent', function () {
      $(ID.stickyChoice).each(function () {
        $(this).prop('checked', false);
      });

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this)
          .find(ID.stickyChoice)
          .prop('checked', false);

        $(ID.edit).prop('disabled', true);
        $(ID.copy).prop('disabled', true);
        $(ID.delete).prop('disabled', true);
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this)
          .find(ID.stickyChoice)
          .prop('checked', true);

        $(ID.edit).prop('disabled', false);
        $(ID.copy).prop('disabled', false);
        $(ID.delete).prop('disabled', false);
      }
      return false;
    });
  }
}
