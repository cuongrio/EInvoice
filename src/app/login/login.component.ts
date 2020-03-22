import { finalize } from 'rxjs/operators';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UserModel } from '@model/user.model';

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
    private authService: AuthService
  ) { }

  ngOnInit() { 
    this.isHasToken();
    this.createForm();
  }

  onSubmit(dataForm: UserModel) {
    if(this.isHasToken()){
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    const remember = dataForm.remember;

    this.authService
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
          this.authService.setCredentials(userLogged, remember);
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

  private isHasToken(){
    const currentUser =
      this.authService.credentials;

    if (currentUser) {
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
