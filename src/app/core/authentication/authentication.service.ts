import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '@app/_models';
import { HttpService } from '..';
import { of } from 'rxjs';
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
    // check on cookie and session
    const savedCredentials = cookieService.get(credentialsKey) || sessionStorage.getItem(credentialsKey);
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
    return of(true);
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
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  public setCredentials(userLogged?: UserModel, remember?: boolean) {
    this._credentials = userLogged || null;

    if (userLogged) {
      const serverUrl  = `${environment.serverUrl}/${userLogged.tenant}`;
      this.cookieService.set(credentialsKey, JSON.stringify(userLogged));
      this.cookieService.set(serverUrlKey, serverUrl);
      sessionStorage.setItem(serverUrlKey, serverUrl);
      if (remember) {
        sessionStorage.setItem(credentialsKey, JSON.stringify(userLogged));
      }
    } else {
      sessionStorage.removeItem(credentialsKey);
      this.cookieService.delete(credentialsKey);

      sessionStorage.removeItem(serverUrlKey);
      this.cookieService.delete(serverUrlKey);
    }
  }
}
