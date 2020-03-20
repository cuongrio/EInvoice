import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CookieService {
    private readonly documentIsAccessible: boolean;

    constructor(
        @Inject(DOCUMENT) private document: any,
        @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    ) {
        this.documentIsAccessible = isPlatformBrowser(this.platformId);
    }

    check(name: string): boolean {
        if (!name || name.length === 0) {
            return false;
        }

        if (!this.documentIsAccessible) {
            return false;
        }

        const regExp: RegExp = this.getCookieRegExp(name);
        const exists: boolean = regExp.test(this.document.cookie);

        return exists;
    }

    get(name: string): string {
        if (!name || name.length === 0) {
            return '';
        }

        if (this.documentIsAccessible && this.check(name)) {
            const regExp: RegExp = this.getCookieRegExp(name);
            const result: RegExpExecArray = regExp.exec(this.document.cookie);

            return result[1];
        }
        return '';

    }

    getAll(): any {
        if (!this.documentIsAccessible) {
            return null;
        }

        const cookies = {};
        const document: any = this.document;

        if (document.cookie && document.cookie !== '') {
            const split: Array<string> = document.cookie.split(';');

            for (let i = 0; i < split.length; i += 1) {
                const currentCookie: Array<string> = split[i].split('=');

                currentCookie[0] = currentCookie[0].replace(/^ /, '');
                cookies[currentCookie[0]] = currentCookie[1];
            }
            if (cookies) {
                return cookies;
            }
        }

        return null;
    }

    /**
     * @param name     Cookie name
     * @param value    Cookie value
     * @param expires  Number of days until the cookies expires or an actual `Date`
     * @param path     Cookie path
     * @param domain   Cookie domain
     * @param secure   Secure flag
     * @param sameSite OWASP samesite token `Lax` or `Strict`
     */
    set(
        name: string,
        value: any,
        expires?: number | Date,
        path?: string,
        domain?: string,
        secure?: boolean,
        sameSite?: 'Lax' | 'Strict'
    ): void {
        if (!this.documentIsAccessible) {
            return;
        }

        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        let cookieString: string = name + '=' + value + ';';

        if (expires) {
            if (typeof expires === 'number') {
                const dateExpires: Date = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);

                cookieString += 'expires=' + dateExpires.toUTCString() + ';';
            } else {
                cookieString += 'expires=' + expires.toUTCString() + ';';
            }
        }

        if (path) {
            cookieString += 'path=' + path + ';';
        }

        if (domain) {
            cookieString += 'domain=' + domain + ';';
        }

        if (secure) {
            cookieString += 'secure;';
        }

        if (sameSite) {
            cookieString += 'sameSite=' + sameSite + ';';
        }

        this.document.cookie = cookieString;
    }

    /**
     * @param name   Cookie name
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    delete(name: string, path?: string, domain?: string): void {
        if (!this.documentIsAccessible) {
            return;
        }

        this.set(name, '', new Date('Thu, 01 Jan 1970 00:00:01 GMT'), path, domain);
    }

    /**
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    clear(): void {
        if (!this.documentIsAccessible) {
            return;
        }

        const cookies: any = this.getAll();  
        for (const cookieName in cookies) {
            if (cookies.hasOwnProperty(cookieName)) {
                this.delete(cookieName);
            }
        }
    }

    private getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');

        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }
}
