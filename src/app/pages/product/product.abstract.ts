import { AlertComponent } from 'ngx-bootstrap'; import { MODAL, MSG } from 'app/constant';
import { ModalService } from '@service/index';

export class ProductAbstract {
    constructor(
        protected modalService: ModalService,
    ) {

    }
    showAlertSuccess(
        msg: string,
        invoiceNo?: string
    ) {
        const modalRef = this.modalService.open(AlertComponent, {
            windowClass: MODAL.w_sm,
            centered: true
        });

        const data = {
            message: msg,
            title: MSG.notify,
            class: MODAL.success
        };
        modalRef.componentInstance.data = data;
    }

    showAlertError(
        msg: string,
        invoiceNo?: string
    ) {
        const modalRef = this.modalService.open(AlertComponent, {
            windowClass: MODAL.w_sm,
            centered: true
        });

        const data = {
            message: msg,
            title: MSG.notify,
            class: MODAL.w_sm,
            highlight: ''
        };
        if (invoiceNo) {
            data.highlight = `${MSG.invoicePrefix} #${invoiceNo}`
        }
        modalRef.componentInstance.data = data;
    }
}
