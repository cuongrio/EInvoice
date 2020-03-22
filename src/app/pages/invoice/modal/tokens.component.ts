import { NgxSpinnerService } from 'ngx-spinner';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { TokenData, InvoiceRequest, SignData } from '@model/index';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, TokenService, InvoiceService } from '@service/index';
import { MSG, MODAL, STATUS } from 'app/constant';
import { AlertComponent } from '@shared/index';

@Component({
    selector: 'app-tokens',
    templateUrl: './tokens.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokensComponent implements OnInit {

    @Input()
    note: {
        id?: string;
        date?: string;
    };

    @Input()
    invoice: InvoiceRequest;

    alias: string;
    tokens: Array<TokenData>;

    errMsg: string;
    btnDisabled = true;

    constructor(
        private activeModal: NgbActiveModal,
        private modalService: ModalService,
        private tokenService: TokenService,
        private ref: ChangeDetectorRef,
        private spinnerService: NgxSpinnerService,
        private invoiceService: InvoiceService
    ) { }

    ngOnInit(): void {
        this.loadTokenData();
        this.ref.markForCheck();
    }

    onSubmit() {
        if (this.alias) {
            let tokenData = {
                alias: this.alias,
                note_id: '',
                note_date: ''
            };
            if (this.note) {
                tokenData = {
                    alias: this.alias,
                    note_id: this.note.id,
                    note_date: this.note.date
                };
            }

            if (this.invoice.type == STATUS.signed) {
                this.callSignRest(tokenData);
            } else {
                this.callDisposeRest(tokenData);
            }

        } else {
            this.errMsg = MSG.tokenRequired;
        }
    }

    close() {
        this.activeModal.dismiss();
    }

    closeModal(response?: any): void {
        this.spinnerService.hide();
        this.modalService.closeActiveModal(response);
    }

    onTokenChange(alias: any) {
        this.errMsg = '';
        this.btnDisabled = false;
        this.alias = alias;
    }

    callSignRest(
        tokenData: any
    ) {
        this.spinnerService.show();
        this.invoiceService
            .exportXmlDocument(
                this.invoice.id
            )
            .subscribe((data: any) => {
                const signData: SignData = {
                    id: +this.invoice.id,
                    cmd: 'sign-xml',
                    alias: tokenData.alias,
                    note_id: tokenData.note_id,
                    note_date: tokenData.note_date,
                    xml_base64: data.xml_base64,
                    xml_ahd_sign_base64: data.xml_ahd_sign_base64
                };
                this.tokenService.messages$.next(signData);
            }, err => {
                this.closeModal({
                    error: err
                });
            });

        this.tokenService.messages$
            .subscribe(data => {
                try {
                    const receiver = JSON.parse(data);

                    if (receiver.error) {
                        this.closeModal({
                            error: receiver
                        });
                    }
                    if (receiver.signed_xml) {
                        this.invoiceService.saveXmlDocument(
                            this.invoice.id,
                            receiver.signed_xml
                        ).subscribe(() => {
                            this.closeModal({
                                error: false,
                                type: this.invoice.type
                            });
                        }, e => {
                            this.closeModal({
                                error: e
                            });
                        });
                    }
                } catch (e) {
                    this.closeModal({
                        error: e
                    });
                }
            }, e => {
                this.closeModal({
                    error: e
                });
            });
    }

    callDisposeRest(
        tokenData: any
    ) {
        this.spinnerService.show();
        const status = this.invoice.status;
        if (status === STATUS.disposed) {
            this.closeModal({
                error: {
                    message: MSG.disposedErr
                }
            });
            return;
        }
        if (status === STATUS.signed) {
            this.invoiceService
                .disposeSignedInvoice(this.invoice.id, tokenData)
                .subscribe(() => {
                    this.closeModal({
                        error: false,
                        type: this.invoice.type
                    });
                }, (err: any) => {
                    this.closeModal({
                        error: err
                    });
                });
        } else {
            this.invoiceService
                .disposeInvoice(this.invoice.id)
                .subscribe(() => {
                    this.closeModal({
                        error: false
                    });
                }, (err: any) => {
                    this.closeModal({
                        error: err
                    });
                });
        }
    }

    private loadTokenData() {
        // have data
        if (this.tokens
            && this.tokens.length > 0) {
            return true;
        }

        // check connection
        // send message  
        this.tokenService.messages$.next({
            cmd: 'token'
        });

        this.spinnerService.show();
        this.tokenService.messages$
            .asObservable()
            .subscribe((data: any) => {
                try {
                    if (data) {
                        this.tokens = JSON.parse(data) as Array<TokenData>;
                    }
                    if (!this.tokens) {
                        this.closeModal({
                            error: true
                        });
                    }
                } catch (e) {
                    this.closeModal({
                        error: true
                    });
                }

                this.spinnerService.hide();
                this.ref.markForCheck();
            }, () => {
                this.spinnerService.hide();
                this.ref.markForCheck();
            });
    }
}
