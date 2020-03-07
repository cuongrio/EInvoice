import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ForgotPassService } from './../_services/core/forgot.service';
import { ValidationService } from '@app/_services/core/validator.service';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html'
})
export class ForgotPassComponent implements OnInit {
  public isLoading = false;
  public submitted = false;
  public errorMessage: string;
  public screen = 1;

  public emailRequest: string;
  public secureCode: string;

  public forgotForm: FormGroup;
  public securityForm: FormGroup;
  public confirmPassForm: FormGroup;

  constructor(
    private ref: ChangeDetectorRef,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private forgotService: ForgotPassService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.createConfirmPassForm();
    this.createSendForm();
    this.createCheckTokenForm();
    this.initRouter();
  }

  onSendSubmit(dataForm: any) {
    this.submitted = true;
    this.isLoading = true;
    if (this.forgotForm.invalid) {
      this.resetLoading();
      return;
    }
    this.emailRequest = dataForm.email;
    this.forgotService.sendReset(dataForm.email).subscribe(data => {
      this.errorMessage = '';
      this.submitted = false;
      this.resetLoading();
      this.screen = 4;
    }, err => {
      this.resetLoading();
      this.submitted = false;
      if (err.error) {
        this.errorMessage = err.error.message;
      }
    });
  }

  onCheckSubmit(dataForm: any) {
    this.submitted = true;
    this.isLoading = true;
    if (this.forgotForm.invalid) {
      this.resetLoading();
      return;
    }

    const body = {
      email: this.emailRequest,
      secure_code: dataForm.secure_code
    };

    this.secureCode = dataForm.secure_code;
    this.forgotService.checkReset(body).subscribe(data => {
      this.errorMessage = '';
      this.screen = 2;
      this.submitted = false;
      this.resetLoading();
    }, err => {
      this.resetLoading();
      this.submitted = false;
      if (err.error) {
        this.errorMessage = err.error.message;
      }
    });
  }

  onDoResetSubmit(dataForm: any) {
    this.submitted = true;
    this.isLoading = true;
    if (this.confirmPassForm.invalid) {
      this.resetLoading();
      return;
    }

    const body = {
      email: this.emailRequest,
      secure_code: this.secureCode,
      new_password: dataForm.password
    };

    this.forgotService.doReset(body).subscribe(data => {
      this.errorMessage = '';
      this.screen = 3;
      this.submitted = false;
      this.resetLoading();
    }, err => {
      this.resetLoading();
      this.submitted = false;
      if (err.error) {
        this.errorMessage = err.error.message;
      }
    });
  }

  private initRouter() {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const email = queryParams.get('email');
      const secure = queryParams.get('secure');
      if (email && secure) {
        const body = {
          email: email,
          secure_code: secure
        };

        // save to context
        this.emailRequest = email;
        this.secureCode = secure;

        this.forgotService.checkReset(body).subscribe(data => {
          this.errorMessage = '';
          this.screen = 2;
          this.submitted = false;
          this.resetLoading();
        }, err => {
          this.initFirstScreenDefault();
          this.forgotForm.patchValue({
            email: email
          });

          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Yêu cầu reset mật khẩu không đúng hoặc hết hạn';
          }
          this.ref.markForCheck();
        });
      } else {
        this.initFirstScreenDefault();
      }
    }, err => {
      this.initFirstScreenDefault();
    });
  }

  private initFirstScreenDefault() {
    this.screen = 1;
    this.submitted = false;
    this.isLoading = false;
    this.createSendForm();
  }

  private resetLoading() {
    setTimeout(function () {
      this.isLoading = false;
      this.ref.markForCheck();
    }.bind(this), 200);
  }

  private createSendForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  private createCheckTokenForm() {
    this.securityForm = this.formBuilder.group({
      email: '',
      secure_code: ['', Validators.compose([Validators.required])]
    });
  }

  private createConfirmPassForm() {
    this.confirmPassForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        this.validationService.passwordValidator
      ])],
      confirmPass: ''
    }, { validators: this.checkPasswords });
  }

  private checkPasswords(group: FormGroup) {
    const password = group.controls.password.value;
    const confirmPass = group.controls.confirmPass.value;

    return password === confirmPass ? null : { notSame: true };
  }
}
