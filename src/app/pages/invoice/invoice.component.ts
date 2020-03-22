import {
  CB, DATE, DISABLED, ID, MSG, ROUTE, SORT, STATUS, STORE_KEY, TOKEN_TYPE, COOKIE_KEY, INIT, PAGE, STATE
} from 'app/constant';
import * as moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceParam, PagingData, SelectData, InvoiceRequest } from '@model/index';
import { NgSelectConfig } from '@ng-select/ng-select';
import { InvoiceService, ReferenceService, TokenService, ModalService } from '@service/index';

import { UtilsService, CookieService } from '@service/index';
import { InvoiceAbstract } from './invoice.abstract';

declare var $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent extends InvoiceAbstract
  implements OnInit, OnDestroy {

  curInvoice: InvoiceRequest = {};

  sortArr = INIT.sort;
  sortByArr = INIT.invSortBy;

  // searching button
  isSearching = false;

  bsConfig = DATE.bsConfig;

  modalRef: BsModalRef;

  signTokenLoading = false;

  bsFromDate: Date;
  bsToDate: Date;

  // expand search
  expandSearch: boolean;
  searchForm: FormGroup;

  page = PAGE.firstPage;
  itemPerPage = PAGE.size;

  totalItems = 0;
  totalElements = 0;
  totalPages = 0;
  pageSizeList = new Array<any>();

  configSingleBox = {
    noResultsFound: ' ',
    showNotFound: false,
    placeholder: ' ',
    toggleDropdown: false,
    displayKey: 'select_item',
    search: false
  };

  private previousPage = 0;

  constructor(
    protected ref: ChangeDetectorRef,
    protected config: NgSelectConfig,
    protected localeService: BsLocaleService,
    protected modalService: ModalService,
    protected spinnerService: NgxSpinnerService,
    protected invoiceService: InvoiceService,
    protected tokenService: TokenService,
    protected router: Router,
    protected referenceService: ReferenceService,
    protected activeRouter: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected utilsService: UtilsService,
    protected cookieService: CookieService
  ) {
    super(
      ref,
      config,
      localeService,
      modalService,
      invoiceService,
      tokenService,
      spinnerService,
      utilsService,
      referenceService,
      cookieService
    );
  }
  ngOnDestroy(): void {
    if (this.referCallback$) {
      this.referCallback$.unsubscribe();
    }
    if (this.disposeCallback$) {
      this.disposeCallback$.unsubscribe()
    }
    if (this.approveCallback$) {
      this.approveCallback$.unsubscribe();
    }
    if (this.signCallback$) {
      this.signCallback$.unsubscribe();
    }
  }

  ngOnInit() {
    this.initDefault();
    this.initForm();
    this.initDataReference();
  }

  resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      sort: SORT.desc,
      sortBy: SORT.inNo
    });
    this.onSubmit(this.searchForm.value);
  }

  signClicked() {
    this.signBtnDisabled = true;
    this.queryRowSelected();

    const type = this.cookieService.get(COOKIE_KEY.signatureType);
    if (type === TOKEN_TYPE.soft) {
      this.invoiceService.signSoft(this.curInvoice.id)
        .subscribe(data => {
          this.showAlertSuccess(
            MSG.signSuccess,
            data.invoice_no
          );
          this.refresh();
        }, err => {
          this.alertError(err)
        });

    } else {
      this.sign(this.curInvoice);
      this.signCallback$.subscribe(() => {
        this.refresh();
      });
    }
  }

  onSubmit(form: any) {
    this.page = 1;
    this.isSearching = true;

    const param: InvoiceParam =
      this.formatForm(form);
    param.page = +this.page;
    param.size = +this.itemPerPage;
    this.putKey(STORE_KEY.inQ, param);

    this.router.navigate([], {
      replaceUrl: true,
      queryParams: param
    });

    this.disableAllButton();
    this.callServiceAndBindTable(param);
  }

  onPageChange(page: number) {
    this.isSearching = true;
    if (this.previousPage !== page) {
      this.previousPage = page;
      const invQuery = this.getKey(STORE_KEY.inQ);

      let param: InvoiceParam;
      if (invQuery) {
        param = JSON.parse(invQuery);
      } else {
        param = {};
      }

      param.page = +this.page;
      if (!param.size) {
        param.size = this.itemPerPage;
      }

      this.disableAllButton();

      this.putKey(STORE_KEY.inQ, param);

      // call service
      this.router.navigate([], {
        replaceUrl: true,
        queryParams: param
      });
      this.callServiceAndBindTable(param);
    }
  }

  onSizeChange(sizeObj: any) {
    let size = PAGE.size;
    if (sizeObj != null) {
      size = sizeObj.code;
    }
    this.isSearching = true;
    const invQuery = this.getKey(STORE_KEY.inQ);

    let param: InvoiceParam;
    if (invQuery) {
      param = JSON.parse(invQuery);
    } else {
      param = {};
    }

    this.itemPerPage = size;

    param.page = PAGE.firstPage;
    param.size = size;

    this.putKey(STORE_KEY.inQ, param);

    // call service
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: param
    });
    this.callServiceAndBindTable(param);

    $(ID.invoiceTable).DataTable().page.len(size).draw();
  }

  // BUTTON ACTION/////
  openClicked() {
    this.queryRowSelected();
    this.router.navigate([`/${ROUTE.invoice}/${ROUTE.detail}/${this.curInvoice.id}`]);
  }

  copyClicked() {
    this.queryRowSelected();
    this.router.navigate([`/${ROUTE.invoice}/${ROUTE.copy}/${this.curInvoice.id}`]);
  }

  expandClicked() {
    if (this.expandSearch) {
      this.expandSearch = false;
    } else {
      this.expandSearch = true;
    }
    this.putKey(STORE_KEY.inE, this.expandSearch);
  }

  printClicked() {
    this.queryRowSelected();
    this.print(this.curInvoice.id);
  }

  printTransfClicked() {
    this.queryRowSelected();
    this.printTransform(this.curInvoice.id);
  }

  openAdjustClicked() {
    this.queryRowSelected();
    this.router.navigate([`/${ROUTE.invoice}/${ROUTE.detail}/${this.curInvoice.id}/${ROUTE.adjust}`]);
  }

  openReplaceClicked() {
    this.queryRowSelected();
    this.router.navigate([`/${ROUTE.invoice}/${ROUTE.detail}/${this.curInvoice.id}/${ROUTE.replace}`]);
  }

  onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.searchForm.patchValue({
        serial: ''
      });
      const data = this.getKey(STORE_KEY.serialCb);
      if (data) {
        try {
          const items = JSON.parse(data) as SelectData[];
          if (items && items.length > 0) {
            this.comboSerial = this.clean(items);
            return;
          }
        } catch{ }
      }
    }

    // load from api
    this.loadSerialByForm(selectData.value);
  }

  approveClicked() {
    this.queryRowSelected();
    this.approve(this.curInvoice);
    this.approveCallback$.subscribe(() => {
      this.refresh();
    });
  }

  downloadClicked() {
    this.queryRowSelected();
    this.downloadInv(this.curInvoice);
  }

  disposeClicked() {
    this.queryRowSelected();
    this.dispose(this.curInvoice);
    this.disposeCallback$.subscribe(() => {
      this.refresh();
    });
  }

  private disableAllButton() {
    $(ID.open).prop(DISABLED, true);
    $(ID.copy).prop(DISABLED, true);
    $(ID.download).prop(DISABLED, true);
    $(ID.print).prop(DISABLED, true);
    $(ID.approve).prop(DISABLED, true);
    $(ID.dispose).prop(DISABLED, true);
    $(ID.sign).prop(DISABLED, true);
    $(ID.printTranform).prop(DISABLED, true);
    $(ID.adjust).prop(DISABLED, true);
    $(ID.replace).prop(DISABLED, true);
  }

  // END BUTTON ACTION
  private queryRowSelected() {
    const row = $(`${ID.stickyChoice}:checked`);
    if (row) {
      const parent = row.parent();
      const no = parent.find('.no-hidden');
      const status = parent.find('.status-hidden');

      this.curInvoice = {
        id: row.val(),
        no: no.val(),
        status: status.val()
      };
    }
  }

  private initRouter() {
    let params: InvoiceParam;

    if (this.activeRouter.snapshot.queryParams) {
      params =
        this.activeRouter.snapshot.queryParams;
 
      if (Object.keys(params).length !== 0) {
        if (params['page']) {
          this.page = +params['page'];
          this.previousPage = +params['page'];
        }
        if (params['size']) {
          this.itemPerPage = +params['size'];
        }
      }
    }

    this.refresh(params);
  }

  private initDefault() {
    const value = this.getKey(STORE_KEY.inQ);
    if (value) {
      this.expandSearch = JSON.parse(value);
    } else {
      this.expandSearch = false;
    }
  }

  private callServiceAndBindTable(params: InvoiceParam) {
    this.isSearching = true;
    this.invoiceService.queryInvoices(params)
      .subscribe((data: any) => {
        if (data) {
          const paging = data as PagingData;
          const dataList = paging.contents;

          if (dataList
            && dataList.length > 0) {
            const size = this.itemPerPage;

            this.totalElements = paging.total_elements;
            this.totalPages = paging.total_pages;
            this.totalItems = paging.total_pages * size;

            const table = $(ID.invoiceTable).dataTable();

            table.fnClearTable();
            table.fnSort([]);
            table.fnAddData(dataList);

          } else {
            this.totalElements = 0;
            this.totalPages = 0;
            this.totalItems = 0;
            $(ID.invoiceTable)
              .dataTable()
              .fnClearTable();
          }
        }

        this.isSearching = false;
        this.ref.markForCheck();
      }, () => {
        this.router.navigate(['/trang-500']);
      });
  }

  private initForm() {
    this.searchForm =
      this.formBuilder.group({
        sort: '',
        sortBy: '',
        fromDate: null,
        toDate: null,
        invoice_no: '',
        form: '',
        status: '',
        serial: '',
        orgTaxCode: ''
      });
    this.searchForm.patchValue({
      sort: SORT.desc,
      sortBy: SORT.inNo
    });
  }

  private getDataStatus(): any {
    const data = this.getKey(STORE_KEY.statusCb);
    if (data) {
      return JSON.parse(data) as SelectData[];
    }
    return [];
  }

  private getDataInvoiceType(): any {
    const json = this.getKey(STORE_KEY.typeCb);
    let arr: any;
    if (json) {
      arr = JSON.parse(json) as SelectData[];
    }
    return arr;
  }

  private initDataTable() {
    const statuses = this.getDataStatus();
    const invoiceTypeArr = this.getDataInvoiceType();

    const table = $(ID.invoiceTable)
      .DataTable({
        paging: false,
        searching: false,
        retrieve: false,
        serverSide: false,
        bLengthChange: false,
        info: false,
        iDisplayLength: PAGE.size,
        destroy: true,
        order: [],
        responsive: true,
        nowrap: true,
        scrollX: true,
        scrollCollapse: true,
        language: {
          emptyTable: MSG.empty
        },
        createdRow: function (row: any) {
          $(row).addClass('row-parent');
        },
        columnDefs: [{
          width: '20px',
          orderable: false,
          targets: 0
        }, {
          width: '30px',
          targets: 1,
          createdCell: function (td: any, cellData: string) {
            if (cellData && cellData.length > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              if (statuses) {
                const status = statuses.find((i: SelectData) => (i.code === cellData));
                if (status) {
                  $(td).html(`<span class="text-bold">${status.value}</span>`);
                } else {
                  $(td).html(`<span class="text-bold">${cellData}</span>`);
                }
              } else {
                $(td).html(`<span class="text-bold">${cellData}</span>`);
              }
            }
          }
        }, {
          width: '48px',
          targets: 2,
          createdCell: function (td: any, cellData: string) {
            if (cellData && cellData.length > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              if (invoiceTypeArr) {
                const invoiceType = invoiceTypeArr
                  .find((i: SelectData) => (i.code === cellData));

                $(td).html(invoiceType?.value);
              }
            }
          }
        }, {
          width: '50px',
          targets: 3
        }, {
          width: '38px',
          targets: 4
        }, {
          width: '38px',
          targets: 5,
          createdCell: function (td: any, cellData: string) {
            $(td).html(`<span class="text-bold">${cellData}</span>`);
            if (cellData && cellData.length > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
            }
          }
        }, {
          width: '40px',
          targets: 6,
          createdCell: function (td: any, cellData: string) {
            if (cellData && cellData.length > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              $(td).html(moment(cellData).format(DATE.vi2));
            }
          }
        }, {
          targets: 7,
          orderable: false,
        }, {
          width: '70px',
          targets: 8,
          createdCell: function (td: any, cellData: string) {
            if (cellData && cellData.length > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
            }
          }
        }, {
          width: '50px',
          targets: 9,
          createdCell: function (td: any, cellData: number) {
            if (cellData && cellData > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              $(td).html(formatCurrency(cellData));
            }
          }
        },
        {
          width: '50px',
          targets: 10,
          createdCell: function (td: any, cellData: number) {
            if (cellData && cellData > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              $(td).html(formatCurrency(cellData));
            }
          }
        },
        {
          width: '50px',
          targets: 11,
          createdCell: function (td: any, cellData: number) {
            if (cellData && cellData > 0) {
              $(td).attr('data-order', cellData);
              $(td).attr('data-sort', cellData);
              $(td).html(formatCurrency(cellData));
            }
          }
        }],
        columns: [{
          className: 'no-padding bg-smoke',
          data: null
        }, {
          data: 'status'
        }, {
          data: 'invoice_type'
        }, {
          data: 'form'
        }, {
          data: 'serial'
        },
        {
          data: 'invoice_no'
        },
        {
          data: 'invoice_date'
        },
        {
          className: 'cbox',
          data: function (row: any, type: any) {
            const hiddenFields = `
              <div class="hidden-col">
                <input type="checkbox" name="stickchoice" value="${row.invoice_id}">
                <input type="hidden" class="no-hidden" value="${row.invoice_no}">
                <input type="hidden" class="status-hidden" value="${row.status}">
                <input type="hidden" class="type-hidden" value="${row.invoice_type}">
                <input type="hidden" class="state-hidden" value="${row.invoice_state}">
              </div>`;

            if (type === 'display'
              && row.customer
              && row.customer.org
            ) {
              const org: string = row.customer.org;

              return `
                <span class="d-overflow" title="${org}">${org}</span>
                ${hiddenFields}
              `;
            } else {
              return `
                <span class="d-overflow"></span>
                ${hiddenFields}
              `;
            }
          }
        }, {
          data: 'customer.tax_code'
        }, {
          className: 'text-right',
          data: 'total_before_tax'
        },
        {
          className: 'text-right',
          data: 'total_tax'
        },
        {
          className: 'text-right',
          data: 'total'
        }],
        select: {
          style: 'single',
          items: 'cells',
          info: false
        },
        drawCallback: function () {
          const pagination = $(this)
            .closest('.dataTables_wrapper')
            .find('.dataTables_paginate');
          pagination.toggle(this.api().page.info().pages > 1);
        }
      });

    table.on('order.dt search.dt', function () {
      let page = getUrlParameter('page');
      page = page > 0 ? page : PAGE.firstPage;

      let size = getUrlParameter('size');
      size = size > 0 ? size : PAGE.size;
      const startIndex = (page - 1) * size + 1;

      table.column(0).nodes({ search: 'applied', order: 'applied' })
        .each(function (cell: any, i: number) {
          cell.innerHTML = (startIndex + i);
        });

      $('invIndx').css("width", "20");
    }).draw();

    // disabled all button
    this.disableAllButton();

    // on row click
    $(`${ID.invoiceTable} tbody`).on(
      'click',
      'tr.row-parent > td > span',
      function (event: any) {
        event.preventDefault();
        event.stopPropagation();
        const tr = $(this).closest('tr');
        tr.click();
      });

    // selected row
    let clicks = 0;
    $(`${ID.invoiceTable} tbody`).on(
      'click',
      'tr.row-parent',
      function (event: any) {
        event.preventDefault();
        clicks++;
        setTimeout(function () { clicks = 0; }, 300);
        if (clicks === 2) {
          $(this)
            .find(ID.stickyChoice)
            .prop('checked', true);
          $(ID.open).click();
        } else {
          if (!$(this).hasClass('selected')) {
            $(ID.stickyChoice).each(function () {
              $(this).prop('checked', false);
            });

            // init status
            $(ID.sign).prop(DISABLED, true);
            $(ID.download).prop(DISABLED, true);
            $(ID.printTranform).prop(DISABLED, true);
            $(ID.approve).prop(DISABLED, true);
            $(ID.adjust).prop(DISABLED, true);
            $(ID.replace).prop(DISABLED, false);

            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $(this)
              .find(ID.stickyChoice)
              .prop('checked', true);

            const status = $(this).find('.status-hidden').val();
            const type = $(this).find('.type-hidden').val();
            const state = $(this).find('.state-hidden').val();

            if (state === STATE.approve
              || state == STATE.signed) {
              $(ID.download).prop(DISABLED, false);
            }

            if (status === STATUS.disposed) {
              $(ID.sign).prop(DISABLED, true);
              $(ID.printTranform).prop(DISABLED, true);
              $(ID.open).prop(DISABLED, false);
              $(ID.copy).prop(DISABLED, true);
              $(ID.print).prop(DISABLED, false);

              $(ID.dispose).prop(DISABLED, true);
              $(ID.adjust).prop(DISABLED, true);
              $(ID.replace).prop(DISABLED, true);
            } else {

              // enable init othercase
              $(ID.open).prop(DISABLED, false);
              $(ID.copy).prop(DISABLED, false);
              $(ID.print).prop(DISABLED, false);
              $(ID.approve).prop(DISABLED, false);
              $(ID.dispose).prop(DISABLED, false);
              $(ID.printTranform).prop(DISABLED, false);
              $(ID.adjust).prop(DISABLED, false);

              if (status === STATUS.created) {
                $(ID.sign).prop(DISABLED, false);
                $(ID.adjust).prop(DISABLED, true);
                $(ID.replace).prop(DISABLED, true);
                $(ID.printTranform).prop(DISABLED, true);
                $(ID.approve).prop(DISABLED, true);

              } else if (status === STATUS.signed) {
                $(ID.approve).prop(DISABLED, false);
                $(ID.sign).prop(DISABLED, true);

              } else if (status === STATUS.approve) {
                $(ID.approve).prop(DISABLED, true);
                $(ID.sign).prop(DISABLED, true);
              }
            }

            if (type === STATUS.replace
              || type === STATUS.replaced) {
              $(ID.replace).prop(DISABLED, true);
            }
            if (type === STATUS.adj
              || type === STATUS.adjed) {
              $(ID.adjust).prop(DISABLED, true);
            }
          }
        }
      });

    function formatCurrency(price: number) {
      if (price > 0) {
        return price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      }
      return price;
    }

    function getUrlParameter(key: string): number {
      var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === key) {
          const val = sParameterName[1] === undefined
            ? true
            : decodeURIComponent(sParameterName[1]);

          return val ? +val : 0;
        }
      }
      return 0;
    };

  }

  private formatForm(form: any) {
    const param: InvoiceParam = {};
    if (form.sort) {
      param.sort = form.sort;
    }
    if (form.sortBy) {
      param.sortBy = form.sortBy;
    }
    if (form.fromDate) {
      param.fromDate = this.toYYYYMMDD(form.fromDate);
    }
    if (form.toDate) {
      param.toDate = this.toYYYYMMDD(form.toDate);
    }

    if (form.invoice_no && form.invoice_no.length > 0) {
      param.invoiceNo = form.invoice_no.trim();
    }
    if (form.form) {
      param.form = form.form;
    }
    if (form.serial) {
      param.serial = form.serial;
    }
    if (form.orgTaxCode
      && form.orgTaxCode.length > 0) {
      param.orgTaxCode = form.orgTaxCode.trim();
    }
    if (form.status) {
      param.status = form.status;
    }
    return param;
  }

  private initDataReference() {
    this.pageSizeList = PAGE.box;
    this.itemPerPage = PAGE.size;

    this.loadComboFromStorage();

    if (this.isNotEmpty(this.comboStatus)
      && this.isNotEmpty(this.comboForm)
      && this.isNotEmpty(this.comboInvoiceType)
      && this.isNotEmpty(this.comboSerial)
    ) {
      this.initDataTable();
      this.initRouter();
      this.ref.markForCheck();
      return;
    }

    // load from references
    this.loadcomboFromRest();
    this.referCallback$.subscribe(() => {
      this.initDataTable();
      this.initRouter();
      this.ref.markForCheck();
    });
  }

  private refresh(
    param?: InvoiceParam
  ) {
    let invParam: InvoiceParam;

    if (param) {
      invParam = {
        ...param,
        ...{
          page: PAGE.firstPage,
          size: PAGE.size
        }
      }; 
      this.expandSearch = true;
    } else {
      const invQuery = this.getKey(STORE_KEY.inQ);
      if (invQuery) {
        invParam = JSON.parse(invQuery);
      } else {
        this.itemPerPage = PAGE.size;
        invParam = {
          page: +this.page,
          size: PAGE.size
        };
      }
    }

    this.page = invParam.page
      ? +invParam.page
      : PAGE.firstPage;

    this.itemPerPage = invParam.size
      ? +invParam.size
      : PAGE.size;

    this.searchForm.patchValue(
      invParam, { onlySelf: true }
    );

    if (invParam.fromDate) {
      const fromDate = moment(
        invParam.fromDate,
        DATE.en
      ).toDate();

      this.bsFromDate = fromDate;
    }

    if (invParam.toDate) {
      this.bsToDate = moment(
        invParam.toDate,
        DATE.en
      ).toDate();
    }

    // set default value form
    this.searchForm.patchValue(
      invParam, { onlySelf: true }
    );

    // call service
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: invParam
    });

    this.callServiceAndBindTable(invParam);
  }

  private loadSerialByForm(form: string) {
    const serialArr = new Array<SelectData>();
    const type = `${CB.serial}${form}`;
    const json = this.getKey(STORE_KEY.serialCb);
    if (json) {
      const serialCb = JSON.parse(json);
      serialCb.forEach((item: SelectData) => {
        if (item.type === type) {
          serialArr.push(item);
        }
      });
      this.comboSerial = this.clean(serialArr);
    }

    // set default picked
    setTimeout(function () {
      this.serialLoading = false;
    }.bind(this), 200);
  }

}
