import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CurrencyInputMaskDirective } from './currency-input-mask.directive';
import { AutofocusDirective } from './autofocus.directive';


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
      CurrencyInputMaskDirective,
      AutofocusDirective
    ],
    exports: [
      CurrencyInputMaskDirective,
      AutofocusDirective
    ]
})
export class AppDirectiveModule {
}
