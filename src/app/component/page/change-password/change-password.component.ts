import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordConfirmationValidator} from "../../../validator/password.confirmation.validator";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmNewPassword: ['', Validators.required]
  }, {validators: passwordConfirmationValidator('newPassword', 'confirmNewPassword')})

  constructor(private formBuilder: FormBuilder) {

  }

  submit(): void { // todo implement
    if (this.changePasswordForm.invalid) {
      alert("The form is filled with invalid data")
      return
    }
  }

  get currentPassword() {
    return this.changePasswordForm.controls['currentPassword']
  }

  get newPassword() {
    return this.changePasswordForm.controls['newPassword']
  }

  get confirmNewPassword() {
    return this.changePasswordForm.controls['confirmNewPassword']
  }
}
