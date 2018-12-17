import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerModel } from '@app/_models';
import { CustomerService } from './../../../_services/app/customer.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { AlertComponent } from '@app/shared/alert/alert.component';

@Component({
  selector: 'app-customers-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerFormComponent implements OnInit {
  public addForm: FormGroup;
  public submitted = false;
  public errorMessage: string;
  public title: string;

  // init state
  public dataForm: CustomerModel;
  public viewMode: boolean;

  public tenant: string;

  constructor(
    private authService: AuthenticationService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) { }
  ngOnInit() {
    this.initForm();
    if (this.dataForm) {
      this.addForm.patchValue(this.dataForm);
      this.title = 'Cập nhật thông tin đối tượng';
    } else {
      this.title = 'Tạo mới thông tin đối tượng';
    }
    this.tenant = this.authService.credentials.tenant;
  }

  public onSubmit(dataForm: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    // new customer
    const customer = new CustomerModel();
    Object.assign(customer, dataForm);
    customer.tenant_id = this.tenant;
    // get tenant


    if (customer.customer_id) {
      this.customerService.update(customer).subscribe(
        data => {
          this.bsModalRef.hide();

          // show box message
          const initialState = {
            message: 'Đã cập nhật thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
          };
          this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
        },
        err => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Đã có lỗi xảy ra, không thể cập nhật đối tượng.';
          }
        }
      );
    } else {
      this.customerService.create(customer).subscribe(
        data => {
          this.bsModalRef.hide();
          // show box message
          const initialState = {
            message: 'Đã tạo mới thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
          };
          this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
        },
        err => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Đã có lỗi xảy ra, không thể tạo mới đối tượng.';
          }
        }
      );
    }
  }

  private initForm() {
    this.addForm = this.formBuilder.group({
      customer_code: ['', Validators.compose([Validators.required])],
      customer_name: ['', Validators.compose([Validators.required])],
      org: ['', Validators.compose([Validators.required])],
      tax_code: '',
      address: '',
      bank_account: '',
      bank: '',
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.compose([Validators.required])]
    });
  }
}
