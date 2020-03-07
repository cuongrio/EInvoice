import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GoodService } from './../../../_services/app/good.service';
import { ProductModel, SelectData } from '@app/_models';
import { ReferenceService } from '@app/_services';
import { Router } from '@angular/router';
import { AlertComponent } from '@app/shared/alert/alert.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit {
  public addForm: FormGroup;
  public submitted = false;
  public errorMessage: string;
  public title: string;
  public comboTaxRate: SelectData[];
  public taxRateCodePicked: string;

  // init state
  public dataForm: ProductModel;
  public taxRateLoading = false;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private goodService: GoodService,
    private modalService: BsModalService,
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef) { }
  ngOnInit() {
    this.initForm();
    this.loadReferences();

    if (this.dataForm) {
      this.addForm.patchValue(this.dataForm);

      this.taxRateCodePicked = this.dataForm.tax_rate_code;
      this.title = 'Cập nhật thông tin hàng hóa';
    } else {
      this.title = 'Tạo mới thông tin hàng hóa';
    }
  }

  public onTaxRateCodeChanged(tax: any) {
    this.addForm.patchValue({
      tax_rate: tax.value
    });
  }

  public onTaxRateChanged(taxRate: any) {
    this.taxRateCodePicked = '';
    this.comboTaxRate.forEach((item: SelectData) => {
      if(item.value == taxRate){
        this.taxRateCodePicked = item.code;
        this.ref.markForCheck();
        return;
      }
    });
  }

  public onSubmit(dataForm: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    const product = new ProductModel();
    Object.assign(product, dataForm);

    if (product.goods_id) {
      this.goodService.update(product).subscribe(
        data => {
          this.bsModalRef.hide();
          const initialState = {
            message: 'Đã cập nhật hàng hóa!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Mã hàng: #${data.goods_code}`
          };
          this.bsModalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Đã có lỗi xảy ra !!!';
          }
        }
      );
    } else {
      this.goodService.create(product).subscribe(
        data => {
          this.bsModalRef.hide();
          const initialState = {
            message: 'Đã tạo mới hàng hóa!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Mã hàng: #${data.code}`
          };
          this.bsModalRef = this.modalService.show(AlertComponent, { animated: false, class: 'modal-sm', initialState });
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Đã có lỗi xảy ra !!!';
          }
          this.ref.markForCheck();
        }
      );
    }
  }
 
  private loadReferences() {
    const comboTaxRateJson = sessionStorage.getItem('comboTaxRate');
    if (comboTaxRateJson) {
      this.comboTaxRate = JSON.parse(comboTaxRateJson) as SelectData[];
      if (this.comboTaxRate.length > 0) {
        return;
      }
    }

    this.referenceService.referenceInfo().subscribe(data => {
      const selectItems = data as SelectData[];
      const comboTaxRate = new Array<SelectData>();
      for (let i = 0; i < selectItems.length; i++) {
        const selectItem = new SelectData();
        Object.assign(selectItem, selectItems[i]);

        if (selectItem.type === 'COMBO_TAX_RATE_CODE') {
          comboTaxRate.push(selectItem);
        }
      }

      this.comboTaxRate = comboTaxRate;

      sessionStorage.setItem('comboTaxRate', JSON.stringify(this.comboTaxRate));

      if (this.dataForm) {
        this.taxRateCodePicked = this.dataForm.tax_rate_code;
      }
      setTimeout(function () {
        this.taxRateLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      this.router.navigate(['/trang-500']);
    });
  }

  private initForm() {
    this.addForm = this.formBuilder.group({
      goods_id: '',
      goods_code: ['', Validators.compose([Validators.required])],
      goods_name: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      tax_rate_code: ['', Validators.compose([Validators.required])],
      tax_rate: '',
      goods_group: ['', Validators.compose([Validators.required])]
    });
  }
}
