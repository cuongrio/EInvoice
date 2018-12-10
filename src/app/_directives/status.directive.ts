import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SelectData } from '@app/_models';

@Directive({ selector: '[appInvoiceStatus]' })

export class InvoiceStatusDirective {
    public statusArr: SelectData[];
    constructor(private el: ElementRef, private control: NgControl) {
        const statusJson = sessionStorage.getItem('comboStatus');
        this.statusArr = JSON.parse(statusJson) as SelectData[];
    }

    @HostBinding('value')
    get bindValue() {
        console.log(this.control.value);
        return 'bbbbb';
    }
}
