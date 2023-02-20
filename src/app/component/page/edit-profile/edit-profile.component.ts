import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../model/user/User";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup = this.formBuilder.group({
      firstName: ['', Validators.maxLength(32)],
      lastName: ['', Validators.maxLength(32)],
      email: ['', [Validators.email, Validators.maxLength(64), Validators.required]],
      phoneNumber: ['', [Validators.maxLength(32), Validators.minLength(3)]]
    }
  )

  constructor(private auth: AuthenticationService, private userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const id = this.auth.getUserId()
    this.userService.findUserById(id)
      .subscribe((user: User) => {
        this.fillFormWithUserData(user)
      })

  }

  fillFormWithUserData(user: User): void {
    this.firstName.setValue(user.firstName)
    this.lastName.setValue(user.lastName)
    this.email.setValue(user.email)
    this.phoneNumber.setValue(user.phoneNumber)
  }

  submit(): void { // todo error handling
    if (this.editProfileForm.invalid) {
      alert("The form is filled with invalid data")
      return
    }
    this.userService.editProfile(this.editProfileForm.value)
      .subscribe((user: User) => {
          window.location.reload()
        }
      )
  }

  get firstName() {
    return this.editProfileForm.controls['firstName']
  }

  get lastName() {
    return this.editProfileForm.controls['lastName']
  }

  get email() {
    return this.editProfileForm.controls['email'];
  }

  get phoneNumber() {
    return this.editProfileForm.controls['phoneNumber']
  }
}
