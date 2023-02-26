import {ErrorService} from "./error.service";
import {Observable, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

export class ServiceErrorHandler {
  protected constructor(protected errorService: ErrorService) {
  }

  protected handleAllErrors(err: HttpErrorResponse): Observable<never> {
    this.errorService.handleAllErrors(err)
    return throwError(() => err)
  }

  protected handleUnknownAndServerErrors(err: HttpErrorResponse): Observable<never> {
    this.errorService.handleServerAndUnknownErrors(err)
    return throwError(() => err)
  }
}
