import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { DATE } from 'app/constant';
import { ModalService } from '@service/index';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-doc',
    templateUrl: './confirm-doc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDocComponent implements OnInit {
 
    note_id: string;
    note_date: Date;

    docForm: FormGroup;
    submitted = false;

    bsConfig = DATE.bsConfig;

    constructor(
        private modalService: ModalService,
        private formBuilder: FormBuilder,
        private ref: ChangeDetectorRef,
        private activeModal: NgbActiveModal
    ) {

    }
    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.docForm = this.formBuilder.group({
            note_id: ['', Validators.compose([Validators.required])],
            note_date: ['', Validators.compose([Validators.required])]
        });

        this.docForm.patchValue({
            note_date: moment(new Date()).format(DATE.vi)
        });
    }

    onSubmit(dataForm: any) {
        this.submitted = true;
        
        if (this.docForm.invalid) {
            this.ref.markForCheck();
            return;
          }

        console.log('dataForm', dataForm);
        this.closeModal({
            note_id: dataForm.note_id,
            note_date: dataForm.note_date
        }); 
    }

    close() {
        this.activeModal.dismiss();
    }

    closeModal(response?: any): void {
        this.modalService.closeActiveModal(response);
        this.submitted = false;
    }
}
