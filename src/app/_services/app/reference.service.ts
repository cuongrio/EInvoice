import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AppService } from '../core/app.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  constructor(private appService: AppService) {}

  /***TENANT */
  referenceInfo() {
    return this.appService.get(`/references`);
  }
}
