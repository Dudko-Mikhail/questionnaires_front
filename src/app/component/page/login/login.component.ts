import {Component} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Credentials} from "../../../model/Credentials";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Subject} from "rxjs";
import {UserService} from "../../../service/user.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.maxLength(64), Validators.required]],
      password: ['', Validators.required],
      rememberMe: [true]
    }
  )
  showBadCredentialsMessage$: Subject<boolean> = new BehaviorSubject(false)

  constructor(private auth: AuthenticationService, private userService: UserService, private formBuilder: FormBuilder,
              private router: Router) {
  }

  submit(): void {
    if (this.loginForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    const email = this.email.value;
    this.auth.logIn(new Credentials(email, this.password.value), this.rememberMe.value)
      .subscribe({
        next: () => {
          this.router.navigate(['fields'])
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 403) {
            if (err.error?.message) {
              this.disabledAccountAction(email)
            }
            this.showBadCredentialsMessage()
          }
        }
      })
  }

  private disabledAccountAction(email: string): void {
    this.userService.sendVerificationMessage(email)
      .subscribe(() => {
        sessionStorage.setItem(environment.continueRegistrationEmailStorageKey, email)
        this.router.navigate(['continue-registration'])
      })
  }

  showBadCredentialsMessage(): void {
    this.showBadCredentialsMessage$.next(true)
    setTimeout(() => this.showBadCredentialsMessage$.next(false), environment.notificationLiveTime)
  }

  get email() {
    return this.loginForm.controls['email']
  }

  get password() {
    return this.loginForm.controls['password']
  }

  get rememberMe() {
    return this.loginForm.controls['rememberMe']
  }
}
