import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Field} from "../model/Field";
import {catchError, Observable, retry, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {PagedResponse} from "../model/PagedResponse";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {
  }

  findFieldsByUserId(userId: number, page?: number, size?: number): Observable<PagedResponse<Field>> {
    let params = new HttpParams()
    if (page) {
      params = params.set('page', page)
    }
    if (size) {
      params = params.set('size', size)
    }
    return this.http.get<PagedResponse<Field>>(`${environment.apiUrl}/api/users/${userId}/fields`, {
      params: params
    })
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      )
  }

  findSessionUserFields(page?: number, size?: number): Observable<PagedResponse<Field>> {
    return this.findFieldsByUserId(this.auth.getUserId(), page, size)
  }

  addField(body: any): Observable<Field> {
    return this.http.post<Field>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}/fields`, body)
      .pipe(retry(3))
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
