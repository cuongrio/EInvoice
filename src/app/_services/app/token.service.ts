import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private appConstant: AppConstant, private appService: AppService) {}

  listToken() {
    return this.appService.get(`${environment.pluginUrl}/token`);
    // return of(this.appConstant.listToken);
  }
}
