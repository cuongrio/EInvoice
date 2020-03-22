import { Component, OnInit, ChangeDetectorRef, TemplateRef, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SelectData, ProductModel } from '@model/index';
import { GoodService, ReferenceService, UtilsService } from '@service/index';
import { AlertComponent } from '@shared/alert/alert.component';
import { STORE_KEY, CB } from 'app/constant';

@Component({
  selector: 'app-product-form',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit {
  addForm: FormGroup;
  submitted = false;
  errorMessage: string;
  title: string;
  comboTaxRate: SelectData[];
  taxRateCodePicked: string;

  // init state
  @Input()
  product: ProductModel;

  taxRateLoading = false;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private utilsService: UtilsService,
    private goodService: GoodService,
    private modalService: BsModalService,
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.initForm();
    this.loadReferences();

    if (this.product) {
      this.addForm.patchValue(this.product);

      this.taxRateCodePicked = this.product.tax_rate_code;
      this.title = 'Cập nhật thông tin hàng hóa';
    } else {
      this.title = 'Tạo mới thông tin hàng hóa';
    }
  }

  onTaxRateCodeChanged(tax: any) {
    this.addForm.patchValue({
      tax_rate: tax.value
    });
  }

  onTaxRateChanged(taxRate: any) {
    this.taxRateCodePicked = '';
    this.comboTaxRate.forEach((item: SelectData) => {
      if (item.value == taxRate) {
        this.taxRateCodePicked = item.code;
        this.ref.markForCheck();
        return;
      }
    });
  }

  onSubmit(dataForm: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    const product = new ProductModel();
    Object.assign(product, dataForm);

    if (product.goods_id) {
      this.goodService.update(product)
        .subscribe(
          (data: any) => { 
            const initialState = {
              message: 'Đã cập nhật hàng hóa!',
              title: 'Thành công!',
              class: 'success',
              highlight: `Mã hàng: #${data.goods_code}`
            };
            this.modalService.show(
              AlertComponent, {
              animated: false,
              class: 'modal-sm',
              initialState
            });
          }, (err: any) => {
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
          const initialState = {
            message: 'Đã tạo mới hàng hóa!',
            title: 'Thành công!',
            class: 'success',
            highlight: `Mã hàng: #${data.code}`
          };
          
          this.modalService.show(
            AlertComponent, {
            animated: false,
            class: 'modal-sm',
            initialState
          });

        }, (err: any) => {
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
    const data = this.getKey(STORE_KEY.taxRateCb)
    if (data) {
      this.comboTaxRate = JSON.parse(data) as SelectData[];
      if (this.comboTaxRate.length > 0) {
        return;
      }
    }

    this.referenceService.referenceInfo()
      .subscribe(data => {
        const selectItems = data as SelectData[];
        const comboTaxRate = new Array<SelectData>();
        for (let i = 0; i < selectItems.length; i++) {
          const selectItem = new SelectData();
          Object.assign(selectItem, selectItems[i]);

          if (selectItem.type === CB.tax) {
            comboTaxRate.push(selectItem);
          }
        }

        this.comboTaxRate = this.clean(comboTaxRate);

        this.putKey(
          STORE_KEY.taxRateCb,
          comboTaxRate
        );

        if (this.product) {
          this.taxRateCodePicked = this.product.tax_rate_code;
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

  private putKey(key: string, value: any) {
    this.utilsService.putKey(key, value);
  }

  private getKey(key: string): any {
    return this.utilsService.getKey(key);
  }

  private clean(
    items: Array<SelectData>
  ): Array<SelectData> {
    return this.utilsService.cleanCb(items);
  }

}
