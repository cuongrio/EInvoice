import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { UserModel } from '@app/_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  public submitted = false;

  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  onSubmit(dataForm: UserModel) {
    this.submitted = true;
    this.isLoading = true;

    const remember = dataForm.remember;

    this.authenticationService
      .login(dataForm)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          this.submitted = false;
          const userLogged = credentials as UserModel;
          this.authenticationService.setCredentials(userLogged, remember);
          this.route.queryParams.subscribe(params =>
            this.router.navigate([params.redirect || '/'], { replaceUrl: true })
          );
        },
        error => {
          this.submitted = false;
          this.error = error;
          this.ref.markForCheck();
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
