import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@app/_models';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { AppService } from '@app/_services/core/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menuItems: any[];
  userLogged: UserModel;
  name: String;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService: AppService) { }

  ngOnInit() {
    this.userLogged = this.authenticationService.credentials;

    if (!this.userLogged) {
      this.router.navigate(['/dang-nhap']);
    }

    this.appService.getTenantInfo().subscribe(data => {
      if (data) {
        if (data.company_name) {
          this.name = data.company_name
        }
        if (data.tax_code) {
          this.name += " | " + data.tax_code;
        }
        if (data.phone) {
          this.name += + " | " + data.phone;
        }
      } else {
        this.name = this.userLogged.name;
      }
    }, err => {
      this.name = this.userLogged.name;
    });
  }

  logoutClicked() {
    this.authenticationService.logout();
    this.router.navigate(['/dang-nhap']);
  }
}
