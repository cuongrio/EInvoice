import { CB, DATE, MODAL, MSG, STATUS, STORE_KEY, COOKIE_KEY, TOKEN_TYPE, CONTENT_TYPE } from 'app/constant';
import * as moment from 'moment';
import { BsLocaleService, defineLocale } from 'ngx-bootstrap';
import { viLocale } from 'ngx-bootstrap/locale';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { InvoiceRequest, SelectData, SignData } from '@model/index';
import { NgSelectConfig } from '@ng-select/ng-select';
import {
    InvoiceService, ModalRef, ModalService, ReferenceService, TokenService, UtilsService, CookieService
} from '@service/index';
import { AlertComponent } from '@shared/index';

import {
    ConfirmApproveComponent, DisposeComponent, DisposeDocComponent, TokensComponent, WsErrComponent
} from './modal/index';

export class InvoiceAbstract {
    // button status
    printLoading = false;
    disposeDisabled = true;
    signBtnDisabled = true;

    //combobox
    comboStatus: SelectData[];
    comboHTTT: SelectData[];
    comboForm: SelectData[];
    comboSerial: SelectData[];
    comboTaxRate: SelectData[];
    comboInvoiceType: SelectData[];

    referCallback$ = new Subject<any>();
    disposeCallback$ = new Subject<any>();
    approveCallback$ = new Subject<any>();
    signCallback$ = new Subject<any>();

    constructor(
        protected ref: ChangeDetectorRef,
        protected config: NgSelectConfig,
        protected localeService: BsLocaleService,
        protected modalService: ModalService,
        protected invoiceService: InvoiceService,
        protected tokenService: TokenService,
        protected spinnerService: NgxSpinnerService,
        protected utilsService: UtilsService,
        protected referenceService: ReferenceService,
        protected cookieService: CookieService
    ) {
        this.config.notFoundText = MSG.empty;
        this.config.loadingText = MSG.loading;
        this.config.addTagText = MSG.add;

        viLocale.invalidDate = MSG.invalid;
        defineLocale('vi', viLocale);
        this.localeService.use('vi');
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
            class: MODAL.success,
            highlight: `${MSG.invoicePrefix} #${invoiceNo}`
        };
        if (invoiceNo) {
            data.highlight = `${MSG.invoicePrefix} #${invoiceNo}`
        }
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

    print(invoice_id: number) {
        this.printLoading = true;
        this.invoiceService
            .print(invoice_id)
            .subscribe(data => {
                const file = new Blob([data], { type: CONTENT_TYPE.html });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                setTimeout(function () {
                    this.printLoading = false;
                    this.ref.markForCheck();
                }.bind(this), 200);
            }, err => {
                this.printLoading = false;
                this.ref.markForCheck();
                this.alertError(err);
            });

    }

    printTransform(invoice_id: number) {
        this.invoiceService
            .printTransform(invoice_id)
            .subscribe(data => {
                const file = new Blob([data], { type: 'text/html' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            }, () => {
                this.showAlertError(
                    MSG.alreadyPrint
                );
            });
    }

    approve(invoice: InvoiceRequest) {
        const modalRef = this.modalService.open(ConfirmApproveComponent, {
            windowClass: MODAL.w_sm,
            centered: true
        });

        modalRef.result.then(() => {
            this.invoiceService.approveInvoice(invoice.id)
                .subscribe(() => {
                    this.showAlertSuccess(
                        MSG.approveSuccess,
                        invoice.no
                    );

                    this.approveCallback$.next();
                }, (err: any) => {
                    modalRef.close();
                    this.alertError(err);
                });
            modalRef.close();
        }, () => {
            modalRef.close();
        });
    }

    sign(invoice: InvoiceRequest) {
        // online ws
        if (this.tokenService.connected) {
            const modalTokenRef = this.modalService.open(TokensComponent, {
                windowClass: MODAL.w_token,
                centered: true
            });

            invoice.type = STATUS.signed;
            modalTokenRef.componentInstance.invoice = invoice;

            // dispose
            modalTokenRef.result.then(res => {
                if (res.error) {
                    this.alertError(res.error);
                    this.signBtnDisabled = false;
                } else {
                    this.showAlertSuccess(
                        MSG.signSuccess,
                        invoice.no
                    );
                    this.signBtnDisabled = false;
                    this.signCallback$.next({ signed: true });
                }
                modalTokenRef.close();
            }, () => {
                modalTokenRef.close();
            });

        } else {
            this.modalService.open(WsErrComponent, {
                windowClass: MODAL.w_sm
            });
        }
    }

    downloadInv(invoice: InvoiceRequest) {
        this.invoiceService.downloadInv(invoice.id)
            .subscribe(res => {
                // let fileName = res.headers.get(CONTENT_TYPE.headerDispose);
                // if (fileName) {
                //     fileName = fileName.slice(fileName.lastIndexOf(CONTENT_TYPE.afterChar) + 1);
                // }

                // if (!fileName) {

                // }
                const fileName = `${CONTENT_TYPE.ahoadon}_${invoice.no}.zip`;
                const blob = new Blob([res.body], {
                    type: CONTENT_TYPE.zip
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = fileName;
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 0);
            }, err => {
                this.alertError(err);
            });
    }

    dispose(
        invoice: InvoiceRequest
    ) {
        let modalDisposeRef: ModalRef;
        let modalTokenRef: ModalRef;

        const type = this.cookieService.get(COOKIE_KEY.signatureType);
        if (type === TOKEN_TYPE.soft) {
            if (invoice.status === STATUS.created) {

                // show modal normal
                modalDisposeRef = this.modalService.open(DisposeComponent, {
                    windowClass: MODAL.w_sm,
                    centered: true
                });

                modalDisposeRef.result.then(() => {
                    this.invoiceService
                        .disposeInvoice(invoice.id)
                        .subscribe(() => {
                            this.showAlertSuccess(
                                MSG.disposeSuccess,
                                invoice.no
                            );
                            this.disposeDisabled = false;
                            this.disposeCallback$.next({
                                disposed: true
                            });
                        }, (err: any) => {
                            this.disposeDisabled = false;
                            this.alertError(err);
                        });
                }, () => {
                    this.disposeDisabled = false;
                    modalDisposeRef.close();
                });
            } else {

                // open modal with noteid
                modalDisposeRef = this.modalService.open(DisposeDocComponent, {
                    windowClass: MODAL.w_md,
                    centered: true
                });

                modalDisposeRef.result.then((data) => {
                    const noteData = {
                        note_id: data.note_id,
                        note_date: this.toYYYYMMDD(data.note_date)
                    };
                    this.invoiceService
                        .disposeSignedInvoice(invoice.id, noteData)
                        .subscribe(() => {
                            this.showAlertSuccess(
                                MSG.disposeSuccess,
                                invoice.no
                            );
                            this.disposeCallback$.next({
                                disposed: true
                            });
                        }, (err: any) => {
                            this.alertError(err);
                        });

                }, () => {
                    modalDisposeRef.close();
                });
            }
            return;
        }

        // online ws
        if (this.tokenService.connected) {
            if (invoice.status === STATUS.created) {
                modalDisposeRef = this.modalService.open(DisposeComponent, {
                    windowClass: MODAL.w_sm,
                    centered: true
                });

                modalDisposeRef.result
                    .then(() => {
                        modalTokenRef = this.modalService.open(TokensComponent, {
                            windowClass: MODAL.w_token,
                            centered: true
                        });

                        invoice.type = STATUS.disposed;
                        modalTokenRef.componentInstance.invoice = invoice;

                        // dispose
                        modalTokenRef.result.then(res => {
                            if (res.error) {
                                this.alertError(res.error);
                            } else {
                                this.showAlertSuccess(
                                    MSG.disposeSuccess,
                                    invoice.no
                                );
                                this.disposeCallback$.next({
                                    disposed: true
                                });
                            }
                            this.signBtnDisabled = false;
                            modalTokenRef.close();
                        }, () => {
                            this.signBtnDisabled = false;
                            modalTokenRef.close();
                        });
                    }, () => {
                        this.signBtnDisabled = false;
                        modalDisposeRef.close();
                    });

            } else {
                modalDisposeRef = this.modalService.open(DisposeDocComponent, {
                    windowClass: MODAL.w_md,
                    centered: true
                });

                // catch 
                modalDisposeRef.result.then((data) => {
                    modalTokenRef = this.modalService.open(TokensComponent, {
                        windowClass: MODAL.w_token,
                        centered: true
                    });
                    if (data) {
                        modalTokenRef.componentInstance.note = {
                            id: data.note_id,
                            date: this.toYYYYMMDD(data.note_date),
                            alias: data.alias
                        };
                    }

                    invoice.type = STATUS.disposed;
                    modalTokenRef.componentInstance.invoice = invoice;

                    // dispose
                    modalTokenRef.result.then(res => {
                        if (res.error) {
                            this.alertError(res.error);
                        } else {
                            this.showAlertSuccess(
                                MSG.disposeSuccess,
                                invoice.no
                            );

                            this.disposeCallback$.next({
                                disposed: true
                            });
                        }
                        this.disposeDisabled = false;
                        modalTokenRef.close();
                    }, () => {
                        this.disposeDisabled = false;
                        modalTokenRef.close();
                    });
                }, () => {
                    this.disposeDisabled = false;
                    modalDisposeRef.close();
                });
            }
        } else {
            this.modalService.open(WsErrComponent, {
                windowClass: MODAL.w_sm,
                centered: true
            });
        }
    }

    isNotEmpty(selects: SelectData[]): boolean {
        return selects && selects.length > 0;
    }


    alertError(err: any) {
        let msg = '';
        if (err.message) {
            msg = err.error.message;
        } else {
            if (err.error) {
                msg = err.error.message;
            }
        }

        this.showAlertError(
            msg
        );
    }

    loadComboFromStorage() {
        this.comboStatus =
            this.getSelectData(STORE_KEY.statusCb);

        this.comboForm =
            this.getSelectData(STORE_KEY.formCb);

        this.comboSerial =
            this.getSelectData(STORE_KEY.serialCb);

        this.comboTaxRate =
            this.getSelectData(STORE_KEY.taxRateCb);

        this.comboHTTT =
            this.getSelectData(STORE_KEY.htttCb);

        this.comboInvoiceType =
            this.getSelectData(STORE_KEY.typeCb);

    }

    loadcomboFromRest() {
        // reset object 
        const comboForm = new Array<SelectData>();
        const comboStatus = new Array<SelectData>();
        const comboInvoiceType = new Array<SelectData>();
        const comboTaxRate = new Array<SelectData>();
        const comboHTTT = new Array<SelectData>();
        const comboSerial = new Array<SelectData>();

        this.referenceService.referenceInfo()
            .subscribe((items: SelectData[]) => {
                const selectItems = items as SelectData[];
                for (let i = 0; i < selectItems.length; i++) {
                    const selectItem = new SelectData();
                    Object.assign(selectItem, selectItems[i]);

                    if (selectItem.type === CB.tax) {
                        comboTaxRate.push(selectItem);
                    }

                    if (selectItem.type === CB.form) {
                        comboForm.push(selectItem);
                    }

                    if (selectItem.type === CB.payment) {
                        comboHTTT.push(selectItem);
                    }

                    if (selectItem.type === CB.status) {
                        comboStatus.push(selectItem);
                    }

                    if (selectItem.type === CB.type) {
                        comboInvoiceType.push(selectItem);
                    }

                    if (selectItem.type.startsWith(CB.serial)) {
                        comboSerial.push(selectItem);
                    }
                }

                this.storeDataSession(
                    comboHTTT,
                    comboTaxRate,
                    comboSerial,
                    comboForm,
                    comboStatus,
                    comboInvoiceType
                );

                // callback
                this.referCallback$.next({ complete: true });
            }, err => {
                this.alertError(err);
            });
    }

    toYYYYMMDD(date: string) {
        const momentDate = moment(date, DATE.vi);
        return momentDate.format(DATE.en);
    }

    putKey(key: string, value: any) {
        this.utilsService.putKey(key, value);
    }

    getKey(key: string): any {
        return this.utilsService.getKey(key);
    }

    clean(
        items: Array<SelectData>
    ): Array<SelectData> {
        return this.utilsService.cleanCb(items);
    }

    getSelectData(key: string): SelectData[] {
        const value = this.getKey(key);
        if (value) {
            const items = JSON.parse(value) as SelectData[];
            return this.clean(items);
        }
    }

    private storeDataSession(
        cbHTTT: any,
        cbTaxRate: any,
        cbSerial: any,
        cbForm: any,
        cbStatus: any,
        cbInvoiceType: any) {
        // set default value  
        if (this.isNotEmpty(cbForm)) {
            this.putKey(STORE_KEY.formCb, cbForm);
            this.comboForm = this.clean(cbForm);
        }

        if (this.isNotEmpty(cbHTTT)) {
            this.putKey(STORE_KEY.htttCb, cbHTTT);
            this.comboHTTT = this.clean(cbHTTT);
        }

        if(this.isNotEmpty(cbTaxRate)){
            this.putKey(STORE_KEY.taxRateCb, cbTaxRate);
            this.comboTaxRate = this.clean(cbTaxRate);
        }

        if(this.isNotEmpty(cbStatus)){
            this.putKey(STORE_KEY.statusCb, cbStatus);
            this.comboStatus = this.clean(cbStatus);
        }
       
        if(this.isNotEmpty(cbSerial)){
            this.putKey(STORE_KEY.serialCb, cbSerial);
            this.comboSerial = this.clean(cbSerial);
        }

        if(this.isNotEmpty(cbInvoiceType)){
            this.putKey(STORE_KEY.typeCb, cbInvoiceType);
            this.comboInvoiceType = this.clean(cbInvoiceType);
        }    
    }
}
