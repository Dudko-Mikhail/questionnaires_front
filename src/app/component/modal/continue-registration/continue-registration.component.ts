import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {interval, take} from "rxjs";

@Component({
  selector: 'app-continue-registration',
  templateUrl: './continue-registration.component.html',
  styleUrls: ['./continue-registration.component.css']
})
export class ContinueRegistrationComponent {
  @Input() email: string
  @ViewChild('sendMessageBtn', {static: false}) timerButton: ElementRef

  constructor(private userService: UserService) {
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

    this.timerButton.nativeElement?.classList.add('disabled')
    this.timerButton.nativeElement?.appendChild(timerSpan);
    const timer = interval(1000)
      .pipe(take(duration))

    timer.subscribe({
      next: (value: number) => {
        this.tickAction(duration - value, timerSpan)
      },
      complete: () => {
        this.timerButton.nativeElement?.classList.remove('disabled')
        timerSpan.remove()
      }
    })
  }

  tickAction(countdown: number, timerElement: HTMLElement): void {
    countdown--;
    timerElement.textContent = countdown.toString()
  }
}
