import { Component, OnInit } from '@angular/core';
import { SelectData } from '@app/_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from './../../../_services/app/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  public reportForm: FormGroup;
  public defaultPrintType: string;
  public submitted = false;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public printTypeCombo = new Array<SelectData>();
  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
  ) {
    this.initCombo();
    this.initForm();
  }

  ngOnInit() { }

  private initCombo() {
    let selectItem = new SelectData();
    selectItem.code = 'TH';
    selectItem.value = 'Tổng hợp';
    this.printTypeCombo.push(selectItem);
    this.defaultPrintType = selectItem.code;

    selectItem = new SelectData();
    selectItem.code = 'CT';
    selectItem.value = 'Chi tiết';
    this.printTypeCombo.push(selectItem);
   
  }

  private initForm() {
    this.reportForm = this.formBuilder.group({
      orgCode: '',
      orgTaxCode: '',
      printType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    this.predefineValue();
  }

  private predefineValue(){
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    const endOfMonth   = moment().endOf('month').format('DD-MM-YYYY');
    this.reportForm.patchValue({
      fromDate: startOfMonth,
      toDate: endOfMonth
    });

  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    if(dataForm){
      // convert date
      dataForm.fromDate = moment(dataForm.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      dataForm.toDate = moment(dataForm.toDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      
      console.log(dataForm);
      // this.reportService.reportStatistic(dataForm).subscribe(data=> {
      //   console.log(data);
      // }, err => {

      // });
    }
  }

}
