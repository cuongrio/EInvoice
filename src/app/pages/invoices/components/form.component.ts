import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  private addForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {

  }
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
      sort: '',
      sortBy: '',
      size: '',
      fromDate: '',
      toDate: '',
      form: '',
      serial: '',
      orgTaxCode: '',
      seller: this.formBuilder.group({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        taxCode: '',
        bankCode: '',
        bank: '',
        address: ''
      }),
      customer: this.formBuilder.group({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        taxCode: '',
        company: '',
        bankCode: '',
        bank: '',
        address: ''
      })
    });
  }

}
