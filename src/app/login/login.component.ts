import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services/authenticate/authentication.service';

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
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.createForm();
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(dataForm: any) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    console.log(dataForm);

    this.loading = true;
    this.authenticationService.login(dataForm.username, dataForm.password)
      .pipe(first())
      .subscribe(data => {
        console.log('data: ' + data);
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.errMessage = error;
      });
    this.loading = false;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }
}
