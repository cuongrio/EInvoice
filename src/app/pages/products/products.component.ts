import { Component, OnInit, HostListener, AfterViewInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductFormComponent } from './components/form.component';
import * as moment from 'moment';
import { GoodService } from '@app/_services';
import { GoodParam, ProductModel } from '@app/_models';
import { AlertComponent } from '@app/shared/alert/alert.component';

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

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private productService: GoodService,
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
    $('#copyLoading').hide();

    function copyToClipboard(text: string) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    }

    // handle copy button
    $('#copyButton').on('click', function (e: any) {
      e.preventDefault();

      // loading
      $('#copyLoading').show();
      $('#copyLoaded').hide();

      var row = $('#productTable tbody').find('tr.selected')[0];
      let customerText = '';
      $(row).find('td').each(function (index: any) {
        const tdText = $(this).text();
        if (index > 0 && tdText && tdText.trim().length > 0) {
          customerText += ',';
        }
        customerText += tdText;
      });
      console.log(customerText);
      copyToClipboard(customerText);

      setTimeout(function () {
        $('#copyLoading').hide();
        $('#copyLoaded').show();
      }, 500);
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
  
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public onSubmit(form: any) { }

  public addNewClicked() {
    this.modalRef = this.modalService.show(ProductFormComponent, { class: 'modal-lg' });
  }

  public editClicked() { }

  public deleteClicked() {
    const customerId = +this.getCheckboxesValue();
    this.productService.delete(customerId).subscribe(
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

  public copyClicked() { }

  public onPageChange(page: number) { }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Something went wrong',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error) {
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

  private initDefault() {
    const expandSearchTmp = localStorage.getItem('productsearch');
    if (expandSearchTmp) {
      this.expandSearch = JSON.parse(expandSearchTmp);
    } else {
      this.expandSearch = false;
    }
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
      createdRow: function (row: any, data: any, index: number) {
        $(row).addClass('row-parent');
      },
      columnDefs: [
        {
          width: '80px',
          targets: 0,
          orderable: true
        },{
          width: '40px',
          targets: 2
        }, {
          width: '60px',
          targets: 3
        }, {
          width: '60px',
          targets: 4
        }, {
          width: '60px',
          targets: 5
        }, {
          width: '60px',
          targets: 6
        }, {
          width: '20px',
          targets: 7,
          orderable: false
        }],
      columns: [{
        data: 'goods_code'
      }, {
        data: 'goods_name'
      }, {
        data: 'unit'
      }, {
        data: function(row: any, type: any) {
          if (type === 'display') {
            return `<p class="text-right">${formatCurrency(row.price)}</p>`;
          } else {
            return '<span></span>';
          }
        }
      }, {
        data: function(row: any, type: any) {
          if (type === 'display') {
            return `<p class="text-right">${row.tax_rate}%</p>`;
          } else {
            return '<span></span>';
          }
        }
      }, {
        data: 'goods_group'
      }, {
        data: function (row: any, type: any) {
          if (type === 'display' && row.insert_date && row.insert_date !== 'null') {
            const dateFormate = moment(row.insert_date).format('DD/MM/YYYY');
            return `<span>${dateFormate}</span>`;
          } else {
            return '<span></span>';
          }
        }
      } , {
        orderable: false,
        data: function (row: any, type: any) {
          if (type === 'display' && row.goods_id && row.goods_id !== 'null') {
            return `
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" name="stickchoice" value="${row.goods_id}" class="form-check-input">
                <i class="input-helper"></i></label>
              </div>
            `;
          } else {
            return '<span></span>';
          }
        }
      }],
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

    function formatCurrency(price: number) {
      if (price > 0) {
        return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
      return price;
    }

    // disabled all button
    bindButtonStatus(true);

    // selected row
    $('#productTable tbody').on('click', 'tr.row-parent', function () {
      console.log('click tr');
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
