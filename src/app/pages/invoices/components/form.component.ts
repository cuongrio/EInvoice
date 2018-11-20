import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  private addForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.createForm();
  }

  cancelClicked() {
    this.addForm.reset();
    this.router.navigate(['/invoices']);
  }

  onSubmit(form: any) {
    console.log(JSON.stringify(form));
  }

  // https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example

  private createForm() {
    this.addForm = this.formBuilder.group({
      invoice_date: '',
      form: '',
      serial: '',
      totalBeforeTax: '',
      total_tax: '',
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
      items: this.formBuilder.array([{
        item_line: '',
        item_code: '',
        item_name: '',
        unit: '',
        price: '',
        tax: '',
        tax_rate: '',
        price_wt: '',
        quantity: '',
        amount: ''
      }])
    });
  }
}
