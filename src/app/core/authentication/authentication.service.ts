import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '@app/_models';
import { HttpService } from '..';
const credentialsKey = 'credentials';
const serverUrlKey = 'serverUrl';
/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: UserModel | null;

  constructor(private httpService: HttpService, private cookieService: CookieService) {
    // check on cookie
    const savedCredentials = cookieService.get(credentialsKey);
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
    const userCookie = this.cookieService.get(credentialsKey);
    if (userCookie) {
      const user = JSON.parse(userCookie) as UserModel;
      return user;
    }
  }

  public setCredentials(userLogged?: UserModel, remember?: boolean) {
    this._credentials = userLogged || null;

    if (userLogged) {
      const serverUrl = `${environment.serverUrl}/${userLogged.tenant}`;
      if (remember) {
        this.cookieService.set(credentialsKey, JSON.stringify(userLogged), 7);
        this.cookieService.set(serverUrlKey, serverUrl, 7);
      } else {
        this.cookieService.set(credentialsKey, JSON.stringify(userLogged));
        this.cookieService.set(serverUrlKey, serverUrl);
      }
    } else {
      this.cookieService.delete(credentialsKey);
      this.cookieService.delete(serverUrlKey);
    }
  }
}
