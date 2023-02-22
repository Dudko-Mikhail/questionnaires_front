import {AfterViewInit, Component, Input} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {interval, take} from "rxjs";

@Component({
  selector: 'app-continue-registration',
  templateUrl: './continue-registration.component.html',
  styleUrls: ['./continue-registration.component.css']
})
export class ContinueRegistrationComponent implements AfterViewInit {
  @Input() email: string
  private timerButton: HTMLButtonElement

  constructor(private userService: UserService) {
  }

  ngAfterViewInit(): void {
    this.timerButton = <HTMLButtonElement>document.getElementById('sendMessageBtn')
  }

  sendMessage(): void {
    this.userService.sendVerificationMessage(this.email)
      .subscribe(() => {
          if (this.timerButton) {
            this.animateCountdown(60)
          }
        }
      )
  }

  animateCountdown(duration: number): void {
    const timerSpan = document.createElement('span')
    timerSpan.textContent = duration.toString();

    this.timerButton.classList.add('disabled')
    this.timerButton.appendChild(timerSpan);
    const timer = interval(1000)
      .pipe(take(duration))

    timer.subscribe({
      next: (value: number) => {
        this.tickAction(duration - value, timerSpan)
      },
      complete: () => {
        this.timerButton.classList.remove('disabled')
        timerSpan.remove()
      }
    })
  }

  tickAction(countdown: number, timerElement: HTMLElement): void {
    countdown--;
    timerElement.textContent = countdown.toString()
  }
}
