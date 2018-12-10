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
      notSame: 'Xác nhận mật khẩu không khớp!',
      invalidEmail: 'Sai định dạng Email!',
      invalidPassword: 'Mật khẩu phải từ 6-20 ký tự, cho phép chữ, số và ký tự !@#$%^&*',
      invalidOrgName: 'Vui lòng không để trống Tên đơn vị hoặc Người mua',
      minlength: `Nhập ít nhất ${validatorValue.requiredLength} ký tự!`
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
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }
}
