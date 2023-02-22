import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordConfirmationValidator} from "../../../validator/password.confirmation.validator";
import {UserService} from "../../../service/user.service";
import {BehaviorSubject, Subject} from "rxjs";

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

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  submit(): void { // todo implement
    if (this.signUpForm.invalid) {
      alert("The form is filled with invalid data")
      return
    }
    this.userService.signUp(this.signUpForm.value)
      .subscribe(() => {
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
