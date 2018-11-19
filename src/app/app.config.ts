import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

/**
 * This is a singleton class
 */
@Injectable()
export class AppConfig {
    // Provide all the Application Configs here

    public version = '1.0.0';
    public locale = 'vi-VI';

    // API Related configs
    public baseApiUrl = 'http://178.128.123.223:8080';

    // Header info
    public jwtCookie = 'auth-token';

    // API Provider
    public apiServer = {
        invoicesUrl: '/1/invoices',
    };

    getPagingParam(page?: number, size?: number): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();
        params.set('page', typeof page === 'number' ? page.toString() : '1');
        params.set('size', typeof page === 'number' ? size.toString() : '20');
        return params;
    }

    getQuerySearchParam(field: string, value: string, page?: number, size?: number): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();
        params.set('field', field);
        params.set('value', value);
        params.set('page', typeof page === 'number' ? page.toString() : '1');
        params.set('size', typeof page === 'number' ? size.toString() : '20');
        return params;
    }
}
