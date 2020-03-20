import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ReportService } from '@service/app/report.service';
import { SelectData } from '@model/index';
import { UtilsService } from '@service/index';
 
@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.scss']
})
export class ManifestComponent {
  public reportForm: FormGroup;
  public defaultPrintType: string;
  public submitted = false;
  public formLoading = false;
  public serialLoading = false;

  public successMessage: string;
  public errMessage: string;

  public comboForm: SelectData[];
  public comboSerial: SelectData[];
  public modalRef: BsModalRef;
  public bsConfig = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue'
  };

  public printTypeCombo = new Array<SelectData>();
  constructor(
    private reportService: ReportService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
  ) {
    this.initDummyCombo();
    this.initForm();
  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    if (dataForm) {
      // convert date
      const formData = new FormData();

      // append your data
      formData.append('orgCode', dataForm.orgCode);
      formData.append('orgTaxCode', dataForm.orgTaxCode);
      formData.append('form', dataForm.form);
      formData.append('serial', dataForm.serial);
      formData.append(
        'fromDate',
        moment(
          dataForm.fromDate,
          'DD-MM-YYYY').format('YYYY-MM-DD')
      );

      formData.append(
        'toDate',
        moment(
          dataForm.toDate,
          'DD-MM-YYYY').format('YYYY-MM-DD')
      );

      this.errMessage = '';
      this.successMessage = '';

      this.reportService.reportManifest(formData)
        .subscribe((data: any) => {
          const file = new Blob(
            [data], {
            type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          const fileURL = URL.createObjectURL(file);
          const fileLinkDownload = document.getElementById("excelLink");
          fileLinkDownload.setAttribute("href", fileURL);
          fileLinkDownload.setAttribute("download", "bang-ke-hoa-don.xls");
          fileLinkDownload.setAttribute("style", "display:inline-block;");
          this.successMessage = "Đã tạo file thành công.";
        }, (err: any) => {
          if (err.status) {
            if (err.status === 404) {
              this.errMessage = "Không tìm thấy kết quả!";
              return;
            }
          }
          if (err.message) {
            this.errMessage = "Đã có lỗi xảy ra: " + err.message;
            return;
          }
          this.errMessage = "Đã có lỗi xảy ra, không thể tạo file báo cáo.";
        });
    }
  }

  private initDummyCombo() {
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
      form: '',
      serial: '',
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
}
