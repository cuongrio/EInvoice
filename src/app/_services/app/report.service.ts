import { Injectable } from '@angular/core';  
import { AppService } from '@app/_services/core/app.service'; 

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private appService: AppService) { }

  reportStatistic(dataForm: any) {
    return this.appService.postFormData(`/reports/report-statistic/`, dataForm);
  }

  reportManifest(dataForm: any) {
    return this.appService.postFormData(`/reports/report-manifest/`, dataForm);
  }
}
