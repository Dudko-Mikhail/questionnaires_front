import {Injectable} from '@angular/core';
import {ServiceErrorHandler} from "./serviceErrorHandler";
import {ErrorService} from "./error.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedResponse} from "../model/PagedResponse";
import {IQuestionnaire} from "../model/IQuestionnaire";
import {catchError, Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService extends ServiceErrorHandler {
  constructor(errorService: ErrorService, private http: HttpClient) {
    super(errorService)
  }

  findQuestionnaires(page?: number, size?: number): Observable<PagedResponse<IQuestionnaire>> {
    let params = new HttpParams()
    if (page) {
      params = params.set('page', page)
    }
    if (size) {
      params = params.set('size', size)
    }
    return this.http.get<PagedResponse<IQuestionnaire>>(`${environment.apiUrl}/api/questionnaires`, {
      params: params
    })
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }
}
