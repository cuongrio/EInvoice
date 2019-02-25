import { Injectable } from '@angular/core';  
import { AppService } from '@app/_services/core/app.service'; 
import { ReportStatistic } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private appService: AppService) { }

  reportStatistic(formData: FormData) {
    return this.appService.postFormData(`/reports/report-statistic/`, formData);
  }

  reportManifest(formData: FormData) {
    return this.appService.postFormData(`/reports/report-manifest/`, formData);
  }
}
