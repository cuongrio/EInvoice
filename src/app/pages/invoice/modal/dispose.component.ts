import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import { ModalService } from '@service/index';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dispose',
    templateUrl: './dispose.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisposeComponent {
    modalRef: BsModalRef;

    constructor(
        private activeModal: NgbActiveModal,
        private modalService: ModalService
    ) { }

    onSubmit() {
        this.closeModal({
            confirmed: true
        });
    }
    close() {
        this.activeModal.dismiss();
    }
    closeModal(response?: any): void {
        this.modalService.closeActiveModal(response);
    }
}
