
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalService } from '@service/index';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-approve',
    templateUrl: './confirm-approve.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmApproveComponent { 
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
