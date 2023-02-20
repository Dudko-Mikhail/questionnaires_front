import {Component} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Credentials} from "../../../model/Credentials";
import {Router} from "@angular/router";

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

  constructor(private auth: AuthenticationService, private formBuilder: FormBuilder, private router: Router) {
  }

  submit(): void {
    if (this.loginForm.invalid) {
      alert("The form is filled with invalid data")
      return
    }
    this.auth.logIn(new Credentials(this.email.value, this.password.value), this.rememberMe.value)
      .subscribe((success: boolean) => {
          if (!success) {
            alert("Errors occurred")
            return
          }
          this.router.navigate(['fields'])
        }
      )
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
