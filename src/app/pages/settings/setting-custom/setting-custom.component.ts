import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectData } from '@app/_models';
import { ReferenceService } from '@app/_services';
@Component({
  selector: 'app-setting-custom',
  templateUrl: './setting-custom.component.html'
})
export class SettingCustomComponent {
  public items = new Array<SelectData>();
  public saveButtonArr = new Array<Boolean>();
  public showMessage = false;
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private referenceService: ReferenceService) {
    this.loadData();
  }

  public editItem(i: number) {
    this.saveButtonArr[i] = true;
  }
  public closeItem(i: number) {
    this.saveButtonArr[i] = false;
  }

  public saveItem(i: number, val: String) {
    if(this.items[i].value === val){
      this.items[i].errMsg = "Thông tin không thay đổi";
      this.showMessage = true;
      setTimeout(function () {
        this.showMessage = false;
        this.ref.markForCheck();
      }.bind(this), 1000);
      return;
    }

    const urlSeg = `${this.items[i].code}/${val}`;
    this.referenceService.updatePreference(urlSeg).subscribe(data => {
      this.saveButtonArr[i] = false;
      this.items[i].successMsg = "Đã cập nhật thành công.";
      this.showMessage = true;
      setTimeout(function () {
        this.showMessage = false;
        this.ref.markForCheck();
      }.bind(this), 1000);

    }, err => {
      this.items[i].errMsg = "Cập nhật thông tin thất bại.";
      this.showMessage = true;
      setTimeout(function () {
        this.showMessage = false;
        this.ref.markForCheck();
      }.bind(this), 1000);
    });
  }

  private loadData() {
    this.referenceService.preferencesList().subscribe((data: SelectData[]) => {
      this.items = data as SelectData[];
    }, err => {
      if (err.status === 403) {
        this.router.navigate(['/dang-nhap']);
      } else {
        this.router.navigate(['/500']);
      }
    });
  }
}
