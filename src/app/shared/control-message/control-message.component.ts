import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from '@service/index';

@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ControlMessageComponent implements OnInit {
  @Input() control: FormControl;

  constructor(
    private validationService: ValidationService
  ) { }

  ngOnInit() { }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName)) {
        return this.validationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }
}
