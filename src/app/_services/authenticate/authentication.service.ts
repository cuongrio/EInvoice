import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { UserModel } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUser: Observable<UserModel>;
  private currentUserSubject: BehaviorSubject<UserModel>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  login(usernameStr: string, passwordStr: string) {
    return this.httpClient.post<any>(`${environment.serverUrl}/login`,
      { username: usernameStr, password: passwordStr }).pipe(
        map(user => {
          console.log('user: ' + user);

          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
