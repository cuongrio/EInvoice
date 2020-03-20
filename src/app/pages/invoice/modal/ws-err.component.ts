import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ws-err',
    templateUrl: './ws-err.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WsErrComponent {

    constructor(
        private activeModal: NgbActiveModal
    ) { }

    close() {
        this.activeModal.dismiss();
    }
}
