import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { CustomerModel } from '@model/customer.model';
import { CustomerService } from '@service/app/customer.service';
import { AlertComponent } from '@shared/alert/alert.component';

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
    public bsModalRef: BsModalRef,
    private authService: AuthService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
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
      this.customerService.update(customer)
        .subscribe((data: any) => {
          this.bsModalRef.hide();

          // show box message
          const initialState = {
            message: 'Đã cập nhật thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
          };
          this.modalService.show(
            AlertComponent, {
            animated: false,
            class: 'modal-sm',
            initialState
          });
        }, (err: any) => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Đã có lỗi xảy ra, không thể cập nhật đối tượng.';
          }
        }
        );
    } else {
      this.customerService.create(customer)
        .subscribe((data: any) => {
          this.bsModalRef.hide();

          // show box message
          const initialState = {
            message: 'Đã tạo mới thành công!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Đối tượng #(${data.customer_id}) ${data.customer_name}`
          };
          this.modalService.show(
            AlertComponent, {
            animated: false,
            class: 'modal-sm',
            initialState
          });
        }, (err: any) => {
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
