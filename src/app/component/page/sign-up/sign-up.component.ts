import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordConfirmationValidator} from "../../../validator/password.validator";
import {UserService} from "../../../service/user.service";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {IUser} from "../../../model/user/IUser";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {NotificationAnimation} from "../../../util/NotificationAnimation";

@Component({
  selector: 'app-sing-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.maxLength(64), Validators.required]],
    password: ['', Validators.required],
    confirmPassword: [''],
    firstName: ['', Validators.maxLength(32)],
    lastName: ['', Validators.maxLength(32)],
    phoneNumber: ['', [Validators.minLength(3), Validators.maxLength(32)]],
  }, {validators: passwordConfirmationValidator()})

  showEmailIsNotUnique$: Subject<boolean> = new BehaviorSubject(false)
  emailSnapshot: string

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
  }

  submit(): void {
    if (this.signUpForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.emailSnapshot = this.email.value
    this.userService.signUp({
      email: this.emailSnapshot,
      password: this.password.value,
      phoneNumber: this.phoneNumber.value ? this.phoneNumber.value : null,
      firstName: this.firstName.value ? this.firstName.value : null,
      lastName: this.lastName.value ? this.lastName.value : null,
    } as IUser)
      .subscribe({
        next: () => {
          sessionStorage.setItem(environment.continueRegistrationEmailStorageKey, this.emailSnapshot)
          this.router.navigate(['continue-registration'])
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            NotificationAnimation.showNotification(this.showEmailIsNotUnique$)
          }
        }
      })
  }

  get email() {
    return this.signUpForm.controls['email']
  }

  get password() {
    return this.signUpForm.controls['password']
  }

  get confirmPassword() {
    return this.signUpForm.controls['confirmPassword']
  }

  get firstName() {
    return this.signUpForm.controls['firstName']
  }

  get lastName() {
    return this.signUpForm.controls['lastName']
  }

  get phoneNumber() {
    return this.signUpForm.controls['phoneNumber']
  }
}
