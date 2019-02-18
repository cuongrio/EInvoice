import { Component, OnInit } from '@angular/core';
import { SelectData } from '@app/_models';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public printTypeCombo = new Array<SelectData>();
  constructor() {
    this.initCombo();
  }

  ngOnInit() {}

  private initCombo(){
    let selectItem = new SelectData();
    selectItem.code = 'TH';
    selectItem.value = 'Tổng hợp';
    this.printTypeCombo.push(selectItem);

    selectItem = new SelectData();
    selectItem.code = 'CT';
    selectItem.value = 'Chi tiết';
    this.printTypeCombo.push(selectItem);
  }

}
