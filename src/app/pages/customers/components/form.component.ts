import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { APIService } from '@app/_services';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-customers-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerFormComponent implements OnInit {
  public addForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef){
      
    }
  ngOnInit() {
    console.log('form init');
    this.initForm();

  }

  public onSubmit(dataForm: any){

  }
  private initForm() {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      address: '',
      phone: '',
      fax: '',
      taxCode: '',
      description: '',
      email: '',
      mobilePhone: '',
      group: ''
    });
  }

}
