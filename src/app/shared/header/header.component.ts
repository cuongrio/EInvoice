import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@app/_models';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menuItems: any[];
  userLogged: UserModel;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.userLogged = this.authenticationService.credentials;
    if(!this.userLogged){
      this.router.navigate(['/login']);
    }
  }

  logoutClicked() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
