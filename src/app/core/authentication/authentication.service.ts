import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UserModel } from '@model/user.model';
import { HttpService } from '@core/http/http.service';
import { CookieService } from '@service/core/cookie.service';
import { COOKIE_KEY } from 'app/constant';
 
/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: UserModel | null;

  constructor(
    private httpService: HttpService,
    private cookieService: CookieService
  ) {
    // check on cookie
    const savedCredentials = cookieService.get(COOKIE_KEY.token);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(user: UserModel) {
    return this.httpService.post(`${environment.serverUrl}/login`, {
      username: user.username,
      password: user.password
    });
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout() {
    this._credentials = null;
    this.setCredentials(null);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): UserModel | null {
    if (this._credentials) {
      return this._credentials;
    }
    const userCookie = this.cookieService.get(COOKIE_KEY.token);
    if (userCookie) {
      const user = JSON.parse(userCookie) as UserModel;
      return user;
    }
  }

  public setCredentials(
    userLogged?: UserModel,
    remember?: boolean
  ) {
    this._credentials = userLogged || null;

    if (userLogged) {
      const serverUrl = `${environment.serverUrl}/api/${userLogged.tenant}`;
      if (remember) {
        this.cookieService.set(COOKIE_KEY.token, JSON.stringify(userLogged), 7);
        this.cookieService.set(COOKIE_KEY.tenant, serverUrl, 7);
      } else {
        this.cookieService.set(COOKIE_KEY.token, JSON.stringify(userLogged));
        this.cookieService.set(COOKIE_KEY.tenant, serverUrl);
      }
    } else {
      this.cookieService.delete(COOKIE_KEY.token);
      this.cookieService.delete(COOKIE_KEY.tenant);
    }
  }
}
