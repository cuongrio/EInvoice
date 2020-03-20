import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { DATE } from 'app/constant';
import { ModalService } from '@service/index';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dispose-doc',
    templateUrl: './dispose-doc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisposeDocComponent implements OnInit {
  
    note_id: string;
    note_date: Date;

    adjForm: FormGroup;
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
        this.adjForm = this.formBuilder.group({
            note_id: ['', Validators.compose([Validators.required])],
            note_date: ['', Validators.compose([Validators.required])]
        });

        this.adjForm.patchValue({
            note_date: moment(new Date()).format(DATE.vi)
        });
    }

    onSubmit(dataForm: any) {
        this.submitted = true;

        if (this.adjForm.invalid) {
            this.ref.markForCheck();
            return;
        }

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
