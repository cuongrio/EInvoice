import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerModel } from '@app/_models';
import { CustomerService } from './../../../_services/app/customer.service';

@Component({
  selector: 'app-customers-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerFormComponent implements OnInit {
  public addForm: FormGroup;
  public submitted = false;
  public errorMessage: string;
  public dataForm: CustomerModel;
  public title: string;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef) {

  }
  ngOnInit() {
    console.log('form init');
    this.initForm();
    if (this.dataForm) {
      this.addForm.patchValue(this.dataForm);
      this.title = 'Cập nhật thông tin đối tượng';
    } else {
      this.title = 'Tạo mới thông tin đối tượng';
    }
  }

  public onSubmit(dataForm: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    // new customer
    const customer = new CustomerModel();
    Object.assign(customer, dataForm);

    if (customer.customer_id) {
      this.customerService.update(customer).subscribe(data => {
        this.bsModalRef.hide();
      }, err => {
        this.errorMessage = err;
      });
    } else {
      this.customerService.create(customer).subscribe(data => {
        this.bsModalRef.hide();
      }, err => {
        this.errorMessage = err;
      });
    }
  }

  private initForm() {
    this.addForm = this.formBuilder.group({
      customer_code: ['', Validators.compose([Validators.required])],
      customer_name: ['', Validators.compose([Validators.required])],
      org: ['', Validators.compose([Validators.required])],
      tax_code: ['', Validators.compose([Validators.required])],
      address: '',
      bank_account: '',
      bank: '',
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.compose([Validators.required])]
    });
  }

}
