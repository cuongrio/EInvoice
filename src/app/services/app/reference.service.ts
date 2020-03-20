import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';

@Injectable()
export class ReferenceService {
  constructor(
    protected appService: AppService
  ) { }

  /***TENANT */
  referenceInfo() {
    return this.appService.get(
      `/references`
    );
  }

  preferencesList() {
    return this.appService.get(
      `/preferences`
    );
  }

  updatePreference(urlSeg: String) {
    return this.appService.post(
      `/preferences/${urlSeg}`,
      null
    );
  }
}
