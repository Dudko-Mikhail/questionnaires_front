import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {currentPasswordEqualsNewValidator, passwordConfirmationValidator} from "../../../validator/password.validator";
import {UserService} from "../../../service/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";

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
  }, {
    validators: [
      passwordConfirmationValidator('newPassword', 'confirmNewPassword'),
      currentPasswordEqualsNewValidator()
    ]
  })
  showInvalidCurrentPasswordMessage$: Subject<boolean> = new BehaviorSubject(false)

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  submit(): void {
    if (this.changePasswordForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.userService.changePassword({
      currentPassword: this.currentPassword.value,
      newPassword: this.newPassword.value
    })
      .subscribe({
        next: () => {
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.currentPassword.setValue('')
            this.showInvalidCurrentPasswordMessage()
          }
        }
      })

  }

  showInvalidCurrentPasswordMessage(): void {
    this.showInvalidCurrentPasswordMessage$.next(true)
    setTimeout(() => this.showInvalidCurrentPasswordMessage$.next(false), environment.notificationLiveTime)
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
