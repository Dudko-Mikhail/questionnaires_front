import {interval, take} from "rxjs";

export class TimerAnimation {
  public static animateCountdown(duration: number, parent: HTMLElement, finishCallback?: Function,
                                 tickCallback?: Function): void {
    if (!parent.classList.contains('disabled')) {
      const timerSpan = document.createElement('span')
      timerSpan.textContent = duration.toString()
      parent.classList.add('disabled')
      parent.appendChild(timerSpan)
      const timer = interval(1000)
        .pipe(take(duration))

      timer.subscribe({
        next: (value: number) => {
          this.tickAction(duration - value, timerSpan)
          tickCallback?.()
        },
        complete: () => {
          parent.classList.remove('disabled')
          timerSpan.remove()
          finishCallback?.()
        }
      })
    }
  }

  private static tickAction(countdown: number, timerElement: HTMLElement): void {
    countdown--
    timerElement.textContent = countdown.toString()
  }

  private constructor() {
  }
}
