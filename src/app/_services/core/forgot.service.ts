import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@app/core';
import { environment } from './../../../environments/environment';

@Injectable()
export class ForgotPassService {
    constructor(
        private router: Router,
        private httpService: HttpService
    ) { }

    public sendReset(body: any) {
        return this.httpService.post(`${environment.serverUrl}/public/reset`, body);
    }

    public checkReset(body: any) {
        return this.httpService.post(`${environment.serverUrl}/public/check-reset`, body);
    }

    public doReset(body: any) {
        return this.httpService.post(`${environment.serverUrl}/public/change-password`, body);
    }
}
