import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductFormComponent } from './components/form.component';
import * as moment from 'moment';
import { GoodService } from '@app/_services';
import { ProductModel } from '@app/_models';
import { AlertComponent } from '@app/shared/alert/alert.component';
import { GoodParam } from './../../_models/param/good.param';

declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public modalRef: BsModalRef;

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
    private productService: GoodService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initDefault();
    this.initDataTable();
    this.initPageHandlerInRouter();
  }

  public expandSearchClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    localStorage.setItem('productsearch', JSON.stringify(this.expandSearch));
  }

  public openClicked() {
    const goodId = +this.getCheckboxesValue();
    this.productService.retrieveById(goodId).subscribe(data => {
      const initialState = {
        dataForm: data,
        viewMode: true
      };
      this.modalRef = this.modalService.show(ProductFormComponent, { animated: false, class: 'modal-lg', initialState });
    });

  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-sm' });
  }

  public onSubmit(form: any) { }

  public addNewClicked() {
    this.modalRef = this.modalService.show(ProductFormComponent, {animated: false, class: 'modal-lg' });
  }

  public editClicked() { }

  public deleteClicked() {
    // const goodId = +this.getCheckboxesValue();
    // this.productService.delete(goodId).subscribe(
    //   data => {
    //     this.modalRef.hide();
    //     const initialState = {
    //       message: 'Đã hủy đối tượng thành công!',
    //       title: 'Thành công!',
    //       class: 'success',
    //       highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
    //     };
    //     this.modalRef = this.modalService.show(AlertComponent, {animated: false, class: 'modal-sm', initialState });
    //   },
    //   err => {
    //     this.modalRef.hide();
    //     this.errorHandler(err);
    //   }
    // );
  }

  public copyClicked() { }

  public onPageChange(page: number) {

  }

  public onSizeChange(sizeObj: any) {
    let size = 20;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const userquery = localStorage.getItem('userquery');
    let param: GoodParam;
    if (userquery) {
      param = JSON.parse(userquery);
    } else {
      param = {};
    }
    param.page = 1;
    param.size = size;

    localStorage.setItem('productquery', JSON.stringify(param));
    // call service
    this.router.navigate([], { replaceUrl: true, queryParams: param });
    this.callServiceAndBindTable(param);

    $('#invoiceTable').DataTable().page.len(size).draw();
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
    this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
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

  private callServiceAndBindTable(params: GoodParam) {
    this.isSearching = true;
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
      setTimeout(function () {
        this.isSearching = false;
        this.ref.markForCheck();
      }.bind(this), 200);

    }, err => {
      this.router.navigate(['/500']);
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
        width: '65%',
        targets: 2,
        orderable: false,
      }, { // don vi tinh
        width: '5%',
        targets: 3,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
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
        width: '4%',
        targets: 5,
        createdCell: function (td: any, cellData: number) {
          if (cellData && cellData >= 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            $(td).html(cellData + '%');
          }else{
            $(td).attr('data-order', '0');
            $(td).attr('data-sort', '0');
            $(td).html('0%');
          }
        }
      }, { // Ngay tao
        width: '8%',
        targets: 6,
        createdCell: function (td: any, cellData: string) {
          if (cellData && cellData.length > 0) {
            $(td).attr('data-order', cellData);
            $(td).attr('data-sort', cellData);
            const dateFormate = moment(cellData).format('DD/MM/YYYY');
            $(td).html(dateFormate);
          }
        }
      }],
      columns: [{
        className: 'text-bold',
        data: 'tax_rate'
      }, {
        className: 'text-bold',
        data: 'goods_code'
      }, {
        className: 'cbox',
        data: function (row: any, type: any) {
          if (type === 'display' && row.goods_name) { 
            return `
              <span>${row.goods_name}</span>
              <div class="hidden-col">
                <input type="checkbox" name="stickchoice" value="${row.goods_code}" class="td-checkbox-hidden">
              </div>
            `;
          } else {
            return '';
          }
        }
      }, {
        data: 'unit'
      }, {
        className: 'text-right',
        data: 'price'
      }, {
        className: 'text-right',
        data: 'tax_rate'
      }, {
        data: 'insert_date'
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
