import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordConfirmationValidator} from "../../../validator/password.validator";
import {BehaviorSubject, Subject} from "rxjs";
import {UserService} from "../../../service/user.service";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {PasswordRecoveryRequest} from "../../../model/PasswordRecoveryRequest";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private email: string
  private code: string
  resetPasswordForm: FormGroup = this.formBuilder.group({
    newPassword: ['', Validators.required],
    confirmNewPassword: ['', Validators.required]
  }, {
    validators: [
      passwordConfirmationValidator('newPassword', 'confirmNewPassword')
    ]
  })
  showInvalidCurrentPasswordMessage$: Subject<boolean> = new BehaviorSubject(false)

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    const emailValue = sessionStorage.getItem(environment.resetPasswordEmailStorageKey)
    const codeValue = sessionStorage.getItem(environment.resetPasswordVerificationCodeStorageKey)
    if (emailValue && codeValue) {
      this.email = emailValue
      this.code = codeValue
    } else {
      this.router.navigate(['login'])
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(environment.resetPasswordVerificationCodeStorageKey)
    sessionStorage.removeItem(environment.resetPasswordEmailStorageKey)
  }

  submit(): void {
    if (this.resetPasswordForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.userService.resetPassword({
      email: this.email,
      newPassword: this.newPassword.value,
      verificationCode: this.code
    } as PasswordRecoveryRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['login'])
          alert('Your password has been successfully changed')
        },
        error: () => {
          this.router.navigate(['login'])
          alert('Something bad happened. Try again later.')
        }
      })
  }

  get newPassword() {
    return this.resetPasswordForm.controls['newPassword']
  }

  get confirmNewPassword() {
    return this.resetPasswordForm.controls['confirmNewPassword']
  }
}
