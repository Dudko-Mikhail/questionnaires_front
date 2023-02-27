import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {environment} from "../../../environments/environment";
import {VerificationRequest} from "../../model/VerificationRequest";

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent implements OnInit {
  verificationCodeForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required, Validators.minLength(36), Validators.maxLength(36)]]
  })
  showCodeIsInvalid$: Subject<boolean> = new BehaviorSubject(false)
  usedCodes: Set<string> = new Set()
  @Input() successAction: Function
  @Input() email: string
  @Input() codeLabel: string = 'Enter verification code from your email'

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.code.valueChanges
      .subscribe(() => {
          if (this.code.valid) {
            this.validateCode()
          }
        }
      )
  }

  get code() {
    return this.verificationCodeForm.controls['code']
  }

  verifyCode() {
    if (this.verificationCodeForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.validateCode()
  }

  validateCode() {
    const size = this.usedCodes.size;
    this.usedCodes.add(this.code.value)
    if (this.usedCodes.size === size) {
      this.showCodeIsInvalid$.next(true)
      setTimeout(() => this.showCodeIsInvalid$.next(false), environment.notificationLiveTime)
      return
    }
    this.userService.validateVerificationCode(new VerificationRequest(this.email, this.code.value))
      .subscribe((isValid: boolean) => {
          if (isValid) {
            this.successAction?.(this.code.value)
          } else {
            this.showCodeIsInvalid$.next(true)
            setTimeout(() => this.showCodeIsInvalid$.next(false), environment.notificationLiveTime)
          }
        }
      )
  }
}
