import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItem} from './../../../_models';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  public addForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.createItemsForm();
    this.addMoreItem();
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

  addMoreItem() {
    let fg = this.formBuilder.group(new ProductItem());
    this.itemFormArray.push(fg);
  }
  deleteItem(idx: number) {
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
      seller: this.formBuilder.group({
        name: '',
        address: '',
        tax_code: '',
        phone: '',
        email: '',
        bank_account: '',
        bank: ''
      }),
      customer: this.formBuilder.group({
        customer_name: '',
        org: '',
        tax_code: '',
        bank_account: '',
        bank: ''
      }),
      items: this.formBuilder.array([])
    });
  }
}
