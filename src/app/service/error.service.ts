import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  message$: Subject<string> = new BehaviorSubject('')

  handleServerAndUnknownErrors(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.message$.next(error.message)
      setTimeout(this.clear.bind(this), environment.notificationLiveTime)
    }
    if (error.status >= 500) {
      this.message$.next(`Server error occurred. ${error.message}`)
      setTimeout(this.clear.bind(this), environment.notificationLiveTime)
    }
  }

  handleAllErrors(error: HttpErrorResponse) {
    this.message$.next(error.message)
    setTimeout(this.clear.bind(this), environment.notificationLiveTime)
  }

  clear(): void {
    this.message$.next('')
  }
}
