import { Injectable } from '@angular/core';  
import { AppService } from '@app/_services/core/app.service'; 

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private appService: AppService) { }

  tenantInfo(tenantCode: string) {
    return this.appService.get(tenantCode);
  }

  updateTenant(tenantCode: string, data: any) {
    return this.appService.post(tenantCode, data);
  }
}
