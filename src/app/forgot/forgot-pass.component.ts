import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { UserModel } from '@app/_models';
import { ForgotPassService } from './../_services/core/forgot.service';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html'
})
export class ForgotPassComponent implements OnInit {
  public isLoading = false;
  public submitted = false;
  public errorMessage: string;
  public infoMessage: string;

  forgotForm: FormGroup;
  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private forgotService: ForgotPassService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.createForm();
  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    this.isLoading = true;
    this.forgotService.sendReset(dataForm.email).subscribe(data => {
      this.infoMessage = 'Một email xác nhận đã gửi tới hòm thư của bạn !!!';
    }, err => {
      if (err.error) {
        this.errorMessage = err.error.message;
      }
    });
  }

  private createForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }
}
