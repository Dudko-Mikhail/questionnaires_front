import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {ErrorService} from "./error.service";
import {environment} from "../../environments/environment";
import {ServiceErrorHandler} from "./serviceErrorHandler";

@Injectable({
  providedIn: 'root'
})
export class ResponseService extends ServiceErrorHandler {
  constructor(errorService: ErrorService, private http: HttpClient) {
    super(errorService)
  }

  sendResponse(id: number, answer: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${id}/responses`,
      {answer: answer})
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }
}
