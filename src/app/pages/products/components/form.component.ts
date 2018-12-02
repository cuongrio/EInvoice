import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductModel } from '@app/_models';
import { GoodService } from './../../../_services/app/good.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit {
  public title: string;
  public addForm: FormGroup;
  public errorMessage: string;
  public submitted = false;
  public dataForm: ProductModel;

  constructor(
    private goodService: GoodService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef) {

  }
  ngOnInit() {
    this.initForm();

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
      this.goodService.update(product).subscribe(data => {
        this.bsModalRef.hide();
      }, err => {
        this.errorMessage = err;
      });
    } else {
      this.goodService.create(product).subscribe(data => {
        this.bsModalRef.hide();
      }, err => {
        this.errorMessage = err;
      });
    }

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
