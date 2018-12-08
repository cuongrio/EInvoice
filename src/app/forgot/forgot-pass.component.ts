import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { ForgotPassService } from './../_services/core/forgot.service';


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

  forgotForm: FormGroup;
  securityForm: FormGroup;
  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private forgotService: ForgotPassService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.createSendForm();
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
      this.screen = 2;
      this.submitted = false;
      this.createCheckTokenForm();
      this.resetLoading();
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

    this.forgotService.checkReset(body).subscribe(data => {
      this.errorMessage = '';
      this.screen = 3;
      this.submitted = false;
      // this.createCheckTokenForm();
      this.resetLoading();
    }, err => {
      this.resetLoading();
      this.submitted = false;
      if (err.error) {
        this.errorMessage = err.error.message;
      }
    });
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
      secure_code: ['', Validators.compose([Validators.required])]
    });
  }
}
