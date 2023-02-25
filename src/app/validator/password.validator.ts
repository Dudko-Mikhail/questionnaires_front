import {AbstractControl, ValidatorFn} from "@angular/forms";

export function passwordConfirmationValidator(passwordInputName?: string,
                                              confirmPasswordInputName?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = passwordInputName ? control.get(passwordInputName)
      : control.get('password')
    const confirmPassword = confirmPasswordInputName ? control.get(confirmPasswordInputName)
      : control.get('confirmPassword')

    if (password?.pristine && confirmPassword?.pristine) {
      return null
    }
    return (password && confirmPassword && confirmPassword.value !== password.value) ? {'mismatch': true} : null
  }
}

export function currentPasswordEqualsNewValidator(currentPasswordInputName?: string,
                                                  newPasswordInputName?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const currentPassword = currentPasswordInputName ? control.get(currentPasswordInputName)
      : control.get('currentPassword');
    const newPassword = newPasswordInputName ? control.get(newPasswordInputName)
      : control.get('newPassword')

    if (currentPassword?.pristine && currentPassword?.pristine) {
      return null
    }
    return (newPassword && currentPassword && currentPassword.value === newPassword.value) ? {'repeat': true} : null
  }
}
