import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GoodService } from './../../../_services/app/good.service';
import { ProductModel, SelectData } from '@app/_models';
import { ReferenceService } from '@app/_services';
import { Router } from '@angular/router';

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
  
  // init state
  public dataForm: ProductModel;
  public viewMode: boolean;
  public taxRateLoading = false;

  constructor(
    private router: Router,
    private goodService: GoodService, 
    private referenceService: ReferenceService,
    private formBuilder: FormBuilder, 
    public bsModalRef: BsModalRef) {}
  ngOnInit() {
    this.initForm();
    this.loadReferences();

    if (this.dataForm) {
      this.addForm.patchValue(this.dataForm);
      this.title = 'Cập nhật thông tin hàng hóa';
    } else {
      this.title = 'Tạo mới thông tin hàng hóa';
    }
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
        },
        err => {
          this.errorMessage = err;
        }
      );
    } else {
      this.goodService.create(product).subscribe(
        data => {
          this.bsModalRef.hide();
        },
        err => {
          this.errorMessage = err;
        }
      );
    }
  }
  private loadReferences() {
    const comboTaxRateJson = sessionStorage.getItem('comboTaxRate');
    if (comboTaxRateJson) {
      this.comboTaxRate = JSON.parse(comboTaxRateJson) as SelectData[];
      return;
    }

    this.referenceService.referenceInfo().subscribe(data=> {
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
      setTimeout(function () {
        this.taxRateLoading = false;
        this.ref.markForCheck();
      }.bind(this), 200);
    }, err => {
      this.router.navigate(['/500']);
    });
  }

  private initForm() {
    this.addForm = this.formBuilder.group({
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
