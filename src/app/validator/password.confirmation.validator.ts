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
