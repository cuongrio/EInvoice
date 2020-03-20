import { BsModalRef } from 'ngx-bootstrap/modal'; 

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '@service/app/customer.service';

@Component({
  selector: 'app-customer-import-excel',
  templateUrl: './import-excel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerImportExcelComponent {
  public errors = new Array<String>();
  public isSuccess = false;
  private arrayBuffer: any;
  private file: File;
  private headers: string[] = [
    "customer_code",
    "customer_name",
    "email",
    "phone",
    "org",
    "tax_code",
    "address",
    "bank_account",
    "bank"
  ]
  constructor(
    private router: Router,
    private customerService: CustomerService,
    public bsModalRef: BsModalRef
  ) {
  }

  public incomingfile(event: any) {
    this.file = event.target.files[0];
  }

  public Upload() {
    this.errors = new Array<string>();
    if(!this.file){
      this.errors.push("Bạn chưa chọn File để upload.");
      return;
    }
    const formData = new FormData();

    // append your data
    formData.append('file', this.file);
    this.customerService.uploadFile(formData)
    .subscribe((data: any) => {
      if (data.error_message) {
        this.isSuccess = false;
        this.errors.push(data.error_message);
        this.errors.push(data.success_row_import);
        this.errors.push(data.index_first_error_row);
        return;
      }
      this.isSuccess = true;

    }, (err: any) => {
      if (err.status == 403) {
        this.router.navigate(['/dang-nhap']);
      }

      let objErr;
      if ('TextDecoder' in window) {
        // Decode as UTF-8
        const dataView = new DataView(err.error);
        const decoder = new TextDecoder('utf8');
        objErr = JSON.parse(decoder.decode(dataView));
      } else {
        // Fallback decode as ASCII
        const decodedString = String.fromCharCode.apply(null, new Uint8Array(err.error));
        objErr = JSON.parse(decodedString);
      }
 
      this.isSuccess = false;

      if (objErr.message) {
        this.errors.push(objErr.message);
      }
    });
 
  }
}
