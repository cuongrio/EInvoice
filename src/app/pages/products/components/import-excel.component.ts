import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as XLSX from 'ts-xlsx';
import { GoodService, ReferenceService } from '@app/_services';
import { ProductModel, SelectData } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-import-excel',
  templateUrl: './import-excel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductImportExcelComponent {
  public errors = new Array<String>();
  public isSuccess = false;
  private arrayBuffer: any;
  private file: File;
  private taxArr: SelectData[];

  private headers: string[] = [
    "goods_code",
    "goods_name",
    "unit",
    "price",
    "tax_rate_code",
    "goods_group"
  ]
  constructor(
    private router: Router,
    private goodService: GoodService,
    public bsModalRef: BsModalRef,
    private referenceService: ReferenceService,
  ) {
    this.initReference();
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
    this.goodService.uploadFile(formData).subscribe(data => {
      if (data.error_message) {
        this.isSuccess = false;
        this.errors.push(data.error_message);
        this.errors.push(data.success_row_import);
        this.errors.push(data.index_first_error_row);
        return;
      }
      this.isSuccess = true;

    }, err => {
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

      console.log(JSON.stringify(objErr));
      this.isSuccess = false;

      if (objErr.message) {
        this.errors.push(objErr.message);
      }
    });

    // let fileReader = new FileReader();
    // fileReader.onload = (e) => {
    //   this.arrayBuffer = fileReader.result;
    //   var data = new Uint8Array(this.arrayBuffer);
    //   var arr = new Array();
    //   for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    //   var bstr = arr.join("");
    //   var workbook = XLSX.read(bstr, { type: "binary" });
    //   var first_sheet_name = workbook.SheetNames[0];
    //   var worksheet = workbook.Sheets[first_sheet_name];
    //   const dataArr = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: this.headers });

    //   const dataSize = dataArr.length;
    //   for (let i = 1; i < dataSize; i++) {
    //     const product = dataArr[i] as ProductModel;
    //     const taxVal = this.getTaxValue(product.tax_rate_code);
    //     product.tax_rate = +taxVal;

    //     this.goodService.create(product).subscribe(data => {
    //       if (i == dataSize - 1) {
    //         this.isSuccess = true;
    //       }
    //     }, err => {
    //       this.isSuccess = false;
    //       if (err.status == 403) {
    //         this.router.navigate(['/dang-nhap']);
    //       }
    //       if (err.error && err.error.message) {
    //         this.errors.push(err.error.message);
    //       }
    //     });
    //   }
    // }
    // fileReader.readAsArrayBuffer(this.file);
  }

  private initReference() {
    this.referenceService.referenceInfo().subscribe((items: SelectData[]) => {
      const selectItems = items as SelectData[];
      this.taxArr = new Array<SelectData>();
      const selectItem = new SelectData();
      for (let i = 0; i < selectItems.length; i++) {
        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          this.taxArr.push(selectItem);
        }
      }
      sessionStorage.setItem('comboTaxRate', JSON.stringify(this.taxArr));
    });
  }
  private getTaxValue(taxCode: string) {
    let json = sessionStorage.getItem('comboTaxRate');
    if (json) {
      this.taxArr = JSON.parse(json) as SelectData[];
      for (let i = 0; i < this.taxArr.length; i++) {
        if (taxCode === this.taxArr[i].code) {
          return this.taxArr[i].value;
        }
      }
    }

    return taxCode;
  }
}
