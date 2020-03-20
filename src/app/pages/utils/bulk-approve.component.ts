import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectData } from '@model/index';
import { AlertComponent } from '@shared/alert/alert.component';

@Component({
  selector: 'app-bulk-approve',
  templateUrl: './bulk-approve.component.html',
  styleUrls: ['./bulk-approve.component.scss']
})
export class BulkApproveComponent {
  public approveForm: FormGroup;
  public submitted = false;
  public formLoading = false;
  public serialLoading = false;

  public comboForm: SelectData[];
  public comboSerial: SelectData[];
  public modalRef: BsModalRef;
  public bsConfig = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue'
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) {
    this.initForm();
  }

  public onSubmit(dataForm: any) {
    this.submitted = true;
    if (dataForm) {
      // convert date
      dataForm.fromDate =
        moment(
          dataForm.fromDate,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD');

      dataForm.toDate =
        moment(
          dataForm.toDate,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD');
    }
  }

  private initForm() {
    this.approveForm = this.formBuilder.group({
      orgCode: '',
      orgTaxCode: '',
      form: '',
      serial: '',
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    this.predefineValue();
  }

  private predefineValue() {
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    const endOfMonth = moment().endOf('month').format('DD-MM-YYYY');
    this.approveForm.patchValue({
      fromDate: startOfMonth,
      toDate: endOfMonth
    });
  }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Không thể xử lý yêu cầu',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error) {
      initialState.message = err.error.message;
    }
    this.modalRef = this.modalService.show(
      AlertComponent, {
      animated: false,
      class: 'modal-sm',
      initialState
    });
  }

}
