import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {TimerAnimation} from "../../../util/TimerAnimation";
import {VerificationRequest} from "../../../model/VerificationRequest";

@Component({
  selector: 'app-continue-registration',
  templateUrl: './continue-registration.component.html',
  styleUrls: ['./continue-registration.component.css']
})
export class ContinueRegistrationComponent implements OnInit, AfterViewInit {
  email: string = ''
  @ViewChild('sendMessageBtn', {static: false}) timerButton: ElementRef

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    const emailValue = sessionStorage.getItem(environment.continueRegistrationEmailStorageKey)
    if (emailValue) {
      this.email = emailValue
    } else {
      this.router.navigate(['login'])
    }
  }

  ngAfterViewInit(): void {
    TimerAnimation.animateCountdown(60, this.timerButton.nativeElement)
  }

  sendMessage(): void {
    this.userService.sendVerificationMessage(this.email)
      .subscribe(() => {
          TimerAnimation.animateCountdown(60, this.timerButton.nativeElement)
        }
      )
  }

  validCodeAction(code: string): void {
    this.userService.activateAccount(new VerificationRequest(this.email, code))
      .subscribe(() => {
        sessionStorage.removeItem(environment.continueRegistrationEmailStorageKey)
        alert('Your account has been activated. Now you can login.')
        this.router.navigate(['login'])
      })
  }
}
