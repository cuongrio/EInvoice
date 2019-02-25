import { Component, OnInit } from '@angular/core';
import { SelectData } from '@app/_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from './../../../_services/app/report.service';
import * as moment from 'moment';
import { ReferenceService } from '@app/_services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertComponent } from '@app//shared/alert/alert.component';

@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.scss']
})
export class ManifestComponent implements OnInit {
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
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };
  public printTypeCombo = new Array<SelectData>();
  constructor(
    private reportService: ReportService,
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) {
    this.initDataReference();
    this.initDummyCombo();
    this.initForm();
  }

  ngOnInit() { }

  public onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.reportForm.patchValue({
        serial: ''
      });
      const serialJson = sessionStorage.getItem('comboSerial');
      if (serialJson) {
        this.comboSerial = JSON.parse(serialJson) as SelectData[];
      }
      return;
    }
    this.loadSerialByForm(selectData.value);
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
      formData.append('fromDate', moment(dataForm.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
      formData.append('toDate', moment(dataForm.toDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

      console.log(formData);
      this.errMessage = '';
      this.successMessage = '';
      
      this.reportService.reportManifest(formData).subscribe(data => {
        const file = new Blob([data], { type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileURL = URL.createObjectURL(file); 
        const fileLinkDownload = document.getElementById("excelLink");
        fileLinkDownload.setAttribute("href", fileURL);
        fileLinkDownload.setAttribute("download", "bang-ke-hoa-don.xls");
        fileLinkDownload.setAttribute("style", "display:inline-block;");
        this.successMessage = "Đã tạo file thành công.";
      }, err => { 
        if(err.status){
          if(err.status === 404){
            this.errMessage = "Không tìm thấy kết quả!";
            return;
          }
        }
        if(err.message){
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

  private predefineValue(){
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    const endOfMonth   = moment().endOf('month').format('DD-MM-YYYY');
    this.reportForm.patchValue({
      fromDate: startOfMonth,
      toDate: endOfMonth
    });
  }

  private initDataReference() {
    let json = sessionStorage.getItem('comboForm');
    if (json) {
      this.comboForm = JSON.parse(json) as SelectData[];
    }

    json = sessionStorage.getItem('comboSerial');
    if (json) {
      this.comboSerial = JSON.parse(json) as SelectData[];
    }
    if (this.comboForm && this.comboSerial) {
      return;
    }

    const comboForm = new Array<SelectData>();
    const comboStatus = new Array<SelectData>();
    const comboInvoiceType = new Array<SelectData>();

    const comboTaxRate = new Array<SelectData>();
    const comboHTTT = new Array<SelectData>();
    const comboSerial = new Array<SelectData>();
    // load from references
    this.referenceService.referenceInfo().subscribe((items: SelectData[]) => {
      const selectItems = items as SelectData[];
      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectData();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          comboTaxRate.push(selectItem);
        }

        if (selectItem.type === 'COMBO_FORM') {
          comboForm.push(selectItem);
        }

        if (selectItem.type === 'COMBO_PAYMENT') {
          comboHTTT.push(selectItem);
        }
        if (selectItem.type === 'COMBO_INVOICE_STATUS') {
          comboStatus.push(selectItem);
        }
        if (selectItem.type === 'COMBO_INVOICE_TYPE') {
          comboInvoiceType.push(selectItem);
        }
        if (selectItem.type.startsWith('COMBO_SERIAL_')) {
          comboSerial.push(selectItem);
        }
      }

      this.storeDataSession(comboHTTT, comboTaxRate, comboSerial, comboForm, comboStatus, comboInvoiceType);
      this.resetLoading();
    }, err => {
      this.resetLoading();
      this.errorHandler(err);
    });

  }

  private errorHandler(err: any) {
    const initialState = {
      message: 'Không thể xử lý yêu cầu',
      title: 'Đã có lỗi!',
      class: 'error'
    };

    if (err.error) {
      initialState.message = err.error.message;
    }
    this.modalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
  }

  private resetLoading() {
    setTimeout(function () {
      this.formLoading = false;
      this.serialLoading = false;
      this.ref.markForCheck();
    }.bind(this), 200);
  }

  private storeDataSession(comboHTTT: any, comboTaxRate: any,
    comboSerial: any, comboForm: any, comboStatus: any, comboInvoiceType: any) {
    // set default value
    sessionStorage.setItem('comboForm', JSON.stringify(comboForm));
    sessionStorage.setItem('comboHTTT', JSON.stringify(comboHTTT));
    sessionStorage.setItem('comboTaxRate', JSON.stringify(comboTaxRate));
    sessionStorage.setItem('comboStatus', JSON.stringify(comboStatus));
    sessionStorage.setItem('comboSerial', JSON.stringify(comboSerial));
    sessionStorage.setItem('comboInvoiceType', JSON.stringify(comboInvoiceType));
  }

  private loadSerialByForm(form: string) {
    this.serialLoading = true;
    const comboSerialArr = new Array<SelectData>();
    const comboType = `COMBO_SERIAL_${form}`;
    const comboSerialJson = JSON.parse(sessionStorage.getItem('comboSerial'));
    if (comboSerialJson) {
      comboSerialJson.forEach((item: SelectData, index: number) => {
        if (item.type === comboType) {
          comboSerialArr.push(item);
        }
      });
      this.comboSerial = comboSerialArr;
    }

    // set default picked
    setTimeout(function () {
      this.serialLoading = false;
    }.bind(this), 200);
  }

}
