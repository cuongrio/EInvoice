import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AppService } from '../core/app.service';
import { AppConstant } from '@app/_mock/mock.data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  constructor(
    private appConstant: AppConstant,
    private appService: AppService) {}

  /***TENANT */
  referenceInfo() {
    // return this.appService.get(`/references`);
    return of(this.appConstant.referenceList);
  }
}
