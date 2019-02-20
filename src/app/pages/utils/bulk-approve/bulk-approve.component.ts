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
  selector: 'app-bulk-approve',
  templateUrl: './bulk-approve.component.html',
  styleUrls: ['./bulk-approve.component.scss']
})
export class BulkApproveComponent implements OnInit {
  public approveForm: FormGroup; 
  public submitted = false;
  public formLoading = false;
  public serialLoading = false;

  public comboForm: SelectData[];
  public comboSerial: SelectData[];
  public modalRef: BsModalRef;
  public bsConfig = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue' };

  constructor(
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { 
    this.initDataReference();
    this.initForm();
  }

  ngOnInit() {
  }

  public onSubmit(dataForm: any) {
    this.submitted = true;
    if(dataForm){
      // convert date
      dataForm.fromDate = moment(dataForm.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      dataForm.toDate = moment(dataForm.toDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      
      console.log(dataForm);
    }
  }

  public onFormChange(selectData: SelectData) {
    if (!selectData) {
      this.approveForm.patchValue({
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

  private initForm() {
    this.approveForm = this.formBuilder.group({
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
    this.approveForm.patchValue({
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
