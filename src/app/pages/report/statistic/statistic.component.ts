import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectData, ReportStatistic } from '@app/_models';
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
  public successMessage: string;
  public errMessage: string;

  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef
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

  private predefineValue() {
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    const endOfMonth = moment().endOf('month').format('DD-MM-YYYY');
    this.reportForm.patchValue({
      fromDate: startOfMonth,
      toDate: endOfMonth
    });

  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    if (dataForm) {
      // convert date
      const formData = new FormData();

      // append your data
      formData.append('orgCode', dataForm.orgCode);
      formData.append('orgTaxCode', dataForm.orgTaxCode);
      formData.append('printType', dataForm.printType);
      formData.append('fromDate', moment(dataForm.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
      formData.append('toDate', moment(dataForm.toDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

      console.log(formData);
      this.errMessage = '';
      this.successMessage = '';

      this.reportService.reportStatistic(formData).subscribe(data => {
        const file = new Blob([data], { type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileURL = URL.createObjectURL(file); 
        const fileLinkDownload = document.getElementById("excelLink");
        fileLinkDownload.setAttribute("href", fileURL);
        fileLinkDownload.setAttribute("download", "bao-cao-thong-ke.xls");
        fileLinkDownload.setAttribute("style", "display:inline-block;");
        this.successMessage = "Đã tạo file thành công.";
        this.hiddenMessage();
      }, err => { 
        if(err.status){
          if(err.status === 404){
            this.errMessage = "Không tìm thấy kết quả!";
            this.hiddenMessage();
            return;
          }
        }
        if(err.message){
          this.errMessage = "Đã có lỗi xảy ra: " + err.message;
          this.hiddenMessage();

          return;
        }
        this.errMessage = "Đã có lỗi xảy ra, không thể tạo file báo cáo.";
        this.hiddenMessage();
      });
    }
  }

  private hiddenMessage(){
    setTimeout(function () {
      this.errMessage = '';
      this.successMessage = '';
      this.ref.markForCheck();
    }.bind(this), 2000);
  }

}
