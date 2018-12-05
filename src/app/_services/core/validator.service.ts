import { Injectable } from '@angular/core';

/**
 * This is a singleton class
 */
@Injectable()
export class ValidationService {
  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Vui lòng không để trống!',
      email: 'Sai định dạng Email!',
      invalidEmail: 'Sai định dạng Email!',
      invalidPassword: 'Mật khẩu chứa ít nhất 6 ký tự!',
      minlength: `Nhập ít nhất ${validatorValue.requiredLength}!`
    };

    return config[validatorName];
  }

  emailValidator(control: any) {
    if (!control.value) {
      return;
    }
    // RFC 2822 compliant regex
    if (control.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return null;
    } else {
      return { invalidEmail: true };
    }
  }

  passwordValidator(control: any) {
    if (!control.value) {
      return;
    }
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  phoneValidator(control: any) {
    if (!control.value) {
      return;
    }

    if (control.value.match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/)) {
      return null;
    } else {
      return { invalidPhone: true };
    }
  }
}
