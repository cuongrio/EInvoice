import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '@service/index';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html'
})
export class InfoComponent {
  public infoForm: FormGroup;
  public submitted = false;
  public successMessage: string;
  public errMessage: string;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef
  ) {
    this.initForm();
  }
  public onSubmit(dataForm: any) {
    this.submitted = true;
    this.appService.updateTenantInfo(dataForm)
      .subscribe(() => {
        this.successMessage = "Đã cập nhật thành công.";
      }, (err: any) => {
        this.errMessage = "Đã xảy ra lỗi. " + err.message;
      });
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
    this.predefineValue();
  }

  private predefineValue() {
    this.appService.getTenantInfo()
      .subscribe(data => {
        this.infoForm.patchValue(data);
      }, err => {
        this.errMessage = "Đã xảy ra lỗi. " + err.message;
      });
  }
}
