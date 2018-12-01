import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from '@app/shared/alert/alert.component';

@Injectable()
export class UtilsService {

    public modalRef: BsModalRef;

    constructor(
        private modalService: BsModalService
    ) {

    }

    public showSuccessAlert(title: string, message: string) {
        const initialState = {
            message: message,
            title: title,
            class: 'success'
        };
        this.modalRef = this.modalService.show(AlertComponent, {class: 'modal-sm', initialState });
    }

    public showErrorAlert(title: string, message: string) {
        const initialState = {
            message: message,
            title: title,
            class: 'error'
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    }

    public showValidatorAlert(title: string, list: Array<string>) {
        const initialState = {
            list: list,
            title: title,
            class: 'error'
        };
        this.modalRef = this.modalService.show(AlertComponent, { class: 'modal-sm', initialState });
    }

}
