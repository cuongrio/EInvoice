import { Component, OnInit } from '@angular/core';
import { SelectData } from '@app/_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReferenceService } from '@app/_services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertComponent } from '@app//shared/alert/alert.component';
import { TenantService } from '@app/_services/app/tenant.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html'
})
export class InfoComponent {
  public infoForm: FormGroup;
  public submitted = false;

  constructor(
    private tenantService: TenantService,
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) {
    this.initForm();
  }
  public onSubmit(dataForm: any) {
    this.submitted = true;
    if(dataForm){
      console.log(dataForm);
    }
  }

  private initForm() {
    this.infoForm = this.formBuilder.group({
      tax_code: ['', Validators.required],
      company_name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      bank_account: '',
      bank: '',
    });
    //this.predefineValue();
  }

  private predefineValue(){
    this.infoForm.patchValue({
      
    });
  }

}
