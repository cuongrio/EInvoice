import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalRef } from './modal-ref';
import { ModalOptions } from './modal-options';
import { isPlatformBrowser } from '@angular/common';

 
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: ModalRef[] = [];
  constructor(
    private ngbModalService: NgbModal,
    @Inject(PLATFORM_ID) private platform: any
    ) {}

  open(content: any, options?: ModalOptions): ModalRef {
    if (!isPlatformBrowser(this.platform))
    {
      return null;
    }
    let activeModal: ModalRef;

    activeModal = this.ngbModalService.open(content, options);
    this.modals.push(activeModal);

    return activeModal;
  }

  getActiveModal(): ModalRef {
    if (!isPlatformBrowser(this.platform))
    {
      return null;
    }
    const modal = this.modals[this.modals.length - 1];
    return modal ? modal : null;
  }

  dismissActiveModal(reason?: any): void {
    if (!isPlatformBrowser(this.platform))
    {
      return;
    }
    const modal: ModalRef = this.getActiveModal();

    if (modal) {
      modal.dismiss(reason);
      this.modals.pop();
    }
  }

  closeActiveModal(reason?: any): void {
    if (!isPlatformBrowser(this.platform))
    {
      return;
    }
    const modal: ModalRef = this.getActiveModal();

    if (modal) {
      modal.close(reason);
      this.modals.pop();
    }
  }

  hasOpenModals(): boolean{
    if (!isPlatformBrowser(this.platform))
    {
      return false;
    }
    return this.ngbModalService.hasOpenModals();
  }
}
