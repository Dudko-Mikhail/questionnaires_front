import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private static ERROR_LIVE_TIME = 6000
  message$: Subject<string> = new BehaviorSubject('')

  handleServerAndUnknownErrors(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.message$.next(error.message)
      setTimeout(this.clear.bind(this), ErrorService.ERROR_LIVE_TIME)
    }
    if (error.status >= 500) {
      this.message$.next(`Server error occurred. ${error.message}`)
      setTimeout(this.clear.bind(this), ErrorService.ERROR_LIVE_TIME)
    }
  }

  handleAllErrors(error: HttpErrorResponse) {
    this.message$.next(error.message)
    setTimeout(this.clear.bind(this), ErrorService.ERROR_LIVE_TIME)
  }

  clear(): void {
    this.message$.next('')
  }
}
