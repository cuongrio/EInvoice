import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService, APIService } from '@app/_services';
import { first } from 'rxjs/operators';
import { ValidationService } from './../_services/validator.service';

// http://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial
// https://github.com/cornflourblue/angular-7-registration-login-example

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  public errMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private apiService: APIService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.createForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.apiService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(data => {
        console.log('data: ' + data);
        this.router.navigate([this.returnUrl]);
      },
        error => {
            this.errMessage = 'erroroororor';
        });
    this.router.navigate([this.returnUrl]);
    this.loading = false;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }
}
