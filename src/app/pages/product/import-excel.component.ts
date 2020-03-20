import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SelectData } from '@model/index';
import { GoodService, ReferenceService, UtilsService } from '@service/index';
import { CB, STORE_KEY } from 'app/constant';
 
@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductImportExcelComponent {
  errors = new Array<String>();
  isSuccess = false;
  private file: File;
  private taxArr: SelectData[];

  constructor(
    private router: Router,
    private goodService: GoodService,
    private utilsService: UtilsService,
    private referenceService: ReferenceService,
  ) {
    this.initReference();
  }

  incomingfile(event: any) {
    this.file = event.target.files[0];
  }

  Upload() {
    this.errors = new Array<string>();
    if (!this.file) {
      this.errors.push("Bạn chưa chọn File để upload.");
      return;
    }
    const formData = new FormData();

    // append your data
    formData.append('file', this.file);
    this.goodService.uploadFile(formData)
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

  private initReference() {
    this.referenceService.referenceInfo()
      .subscribe((items: SelectData[]) => {
        const selectItems = items as SelectData[];
        this.taxArr = new Array<SelectData>();
        const selectItem = new SelectData();
        for (let i = 0; i < selectItems.length; i++) {
          if (selectItem.type === CB.tax) {
            this.taxArr.push(selectItem);
          }
        }

        this.putKey(STORE_KEY.taxRateCb, this.taxArr);
      });
  }

  private putKey(key: string, value: any) {
    this.utilsService.putKey(key, value);
  }

  private clean(
    items: Array<SelectData>
  ): Array<SelectData> {
    return this.utilsService.cleanCb(items);
  }
}
