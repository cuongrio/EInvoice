import { Injectable } from '@angular/core'; 
import { environment } from '@env/environment';
import { HttpService } from '@core/http/http.service';

@Injectable()
export class ForgotPassService {
    constructor(
        private httpService: HttpService
    ) { }

    public sendReset(body: any) {
        return this.httpService.post(
            `${environment.serverUrl}/public/reset`,
            body
        );
    }

    public checkReset(body: any) {
        return this.httpService.post(
            `${environment.serverUrl}/public/check-reset`,
            body
        );
    }

    public doReset(body: any) {
        return this.httpService.post(
            `${environment.serverUrl}/public/change-password`,
            body
        );
    }
}
