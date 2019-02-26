import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as XLSX from 'ts-xlsx';
import { CustomerService } from '@app/_services';
import { CustomerModel } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-import-excel',
  templateUrl: './import-excel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerImportExcelComponent {
  public errors = new Array<String>();
  private arrayBuffer: any;
  private file: File;
  private isSuccess = false;
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
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const dataArr = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: this.headers });

      const dataSize = dataArr.length;
      for (let i = 1; i < dataSize; i++) {
        const customer = dataArr[i] as CustomerModel;
        this.customerService.create(customer).subscribe(data => {
          if(i == dataSize - 1){
            this.isSuccess = true;
          }
        }, err => {
          this.isSuccess = false;
          if (err.status == 403) {
            this.router.navigate(['/dang-nhap']);
          }
          if(err.error && err.error.message){
            this.errors.push(err.error.message);
          }
        });
      }
    }
    fileReader.readAsArrayBuffer(this.file);
  }
}
