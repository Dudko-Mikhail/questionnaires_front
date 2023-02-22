import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Field} from "../model/Field";
import {catchError, Observable, retry, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {PagedResponse} from "../model/PagedResponse";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  constructor(private http: HttpClient, private auth: AuthenticationService, private errorService: ErrorService) {
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
        catchError(this.handleError.bind(this))
      )
  }

  deleteFieldById(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/fields/${id}`)
      .pipe(
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  findSessionUserFields(page?: number, size?: number): Observable<PagedResponse<Field>> {
    return this.findFieldsByUserId(this.auth.getUserId(), page, size)
  }

  addField(body: any): Observable<Field> {
    return this.http.post<Field>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}/fields`, body)
      .pipe(
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    this.errorService.handleServerAndUnknownErrors(err)
    return throwError(() => err)
  }
}
