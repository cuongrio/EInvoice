import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItem, SelectItem } from './../../../_models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { APIService } from './../../../_services/api.service';

declare var $: any;
type ArrayObject = Array<SelectItem>;

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public addForm: FormGroup;
  public invoiceItem: any;
  public columNo = 11;
  public modalRef: BsModalRef;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-default' };

  // combobox
  public serialArr: ArrayObject = [];

  @ViewChild('overTabLength') overTabLength: any;

  public tabs: any[] = [{ title: 'Hóa đơn 1', active: true, removable: false, disabled: false }];

  private subscription: Subscription;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.initRouter();
    this.createItemsForm();
    this.formSetDefault();

    for (let i = 0; i < 5; i++) {
      this.stickyButtonAdd();
    }
  }

  ngAfterViewInit() {
    this.initSelectBox();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // TAB
  addNewTab(): void {
    const newTabIndex = this.tabs.length + 1;
    if (newTabIndex > 10) {
      this.showOverTabLength();
    } else {
      this.tabs.push({
        title: `Hóa đơn ${newTabIndex}`,
        active: true,
        disabled: false,
        removable: true
      });
    }
  }

  showOverTabLength() {
    this.modalRef = this.modalService.show(this.overTabLength, { class: 'modal-sm' });
  }

  closeOverTabLength(): void {
    this.modalRef.hide();
  }

  removeTabHandler(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    console.log('Remove Tab handler');
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  onSubmit(form: any) {
    console.log(JSON.stringify(form));
  }

  get itemFormArray(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  deleteLineClicked(idx: number) {
    this.stickyButtonDelete(idx);
  }

  addMoreLineClicked() {
    this.stickyButtonAdd();
  }

  private initRouter() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      console.log('params: ' + params);
      if (params.id) {
        // get service
        this.invoiceItem = {};
        this.invoiceItem.invoice_id = params.id;
      } else {
        this.invoiceItem = {};
      }
    });
  }

  private stickyButtonAdd() {
    const emptyProductLine: ProductItem = {
      item_code: '',
      item_name: '',
      quantity: '',
      unit: '',
      price: '',
      price_wt: '',
      vat: '',
      total_vat: '',
      total_price: '',
      status: ''
    };

    const fg = this.formBuilder.group(emptyProductLine);
    this.itemFormArray.push(fg);
  }

  private stickyButtonDelete(idx: number) {
    this.itemFormArray.removeAt(idx);
  }

  // https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example

  private createItemsForm() {
    this.addForm = this.formBuilder.group({
      invoice_date: '',
      form: '',
      serial: '',
      totalBeforeTax: '',
      total_tax: '',
      total: '',
      customer: this.formBuilder.group({
        customer_name: '',
        org: '',
        tax_code: '',
        bank_account: '',
        bank: '',
        address: ''
      }),
      items: this.formBuilder.array([])
    });
  }

  private formSetDefault() {
    this.addForm.patchValue({
      invoice_date: new Date()
    });

    this.getSerialCombobox();
  }

  private getSerialCombobox() {
    this.apiService.getSerialCombobox().subscribe(data => {
      console.log(data);
    });
  }

  private initSelectBox() {
    $('select').select2({ minimumResultsForSearch: Infinity });
  }
}
