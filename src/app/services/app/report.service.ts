import { Injectable } from '@angular/core';
import { AppService } from '../core/app.service';

@Injectable()
export class ReportService {
  constructor(
    protected appService: AppService
  ) { }

  reportStatistic(formData: FormData) {
    return this.appService.postFormData(
      `/reports/report-statistic/`,
      formData
    );
  }

  reportManifest(formData: FormData) {
    return this.appService.postFormData(
      `/reports/report-manifest/`,
      formData
    );
  }
}
