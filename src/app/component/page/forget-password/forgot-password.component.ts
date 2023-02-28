import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Subject} from "rxjs";
import {TimerAnimation} from "../../../util/TimerAnimation";
import {HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {NotificationAnimation} from "../../../util/NotificationAnimation";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgetPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.maxLength(64)]]
  })
  isMessageSent$: Subject<boolean> = new BehaviorSubject(false)
  showEmailIsInvalid$: Subject<boolean> = new BehaviorSubject(false)
  emailSnapshot: string
  @ViewChild('sendMessageBtn', {static: false}) timerButton: ElementRef

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {
  }

  get email() {
    return this.forgetPasswordForm.controls['email']
  }


  sendMessage() {
    if (this.forgetPasswordForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.emailSnapshot = this.email.value
    this.userService.sendResetPasswordMessage(this.emailSnapshot)
      .subscribe({
        next: () => {
          TimerAnimation.animateCountdown(60, this.timerButton.nativeElement)
          this.isMessageSent$.next(true)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            NotificationAnimation.showNotification(this.showEmailIsInvalid$)
          }
        }
      })
  }

  validCodeAction(code: string): void {
    sessionStorage.setItem(environment.resetPasswordEmailStorageKey, this.email.value)
    sessionStorage.setItem(environment.resetPasswordVerificationCodeStorageKey, code)
    this.router.navigate(['reset-password'])
  }
}
