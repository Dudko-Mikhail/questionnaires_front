import {Injectable} from '@angular/core';
import {ServiceErrorHandler} from "./serviceErrorHandler";
import {ErrorService} from "./error.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedResponse} from "../model/PagedResponse";
import {IQuestionnaire} from "../model/questionnaire/IQuestionnaire";
import {catchError, Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";
import {ParamsHelper} from "../util/ParamsHelper";
import {QuestionnaireRequest} from "../model/questionnaire/QuestionnaireRequest";
import {QuestionnaireFilter} from "../model/QuestionnaireFilter";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService extends ServiceErrorHandler {
  constructor(errorService: ErrorService, private http: HttpClient) {
    super(errorService)
  }

  findQuestionnaireById(questionnaireId: number): Observable<IQuestionnaire> {
    return this.http.get<IQuestionnaire>(`${environment.apiUrl}/api/questionnaires/${questionnaireId}`)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  findQuestionnaires(page?: number, size?: number): Observable<PagedResponse<IQuestionnaire>> {
    return this.http.get<PagedResponse<IQuestionnaire>>(`${environment.apiUrl}/api/questionnaires`, {
      params: ParamsHelper.addPageAndSize(new HttpParams(), page, size)
    })
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  findActiveQuestionnaires(filter: QuestionnaireFilter, page?: number, size?: number): Observable<PagedResponse<IQuestionnaire>> {
    let params: HttpParams = ParamsHelper.addPageAndSize(new HttpParams(), page, size)
    params = ParamsHelper.addParam(params, 'isActive', true)
    params = ParamsHelper.fillWithObjectData(params, filter)
    return this.http.get<PagedResponse<IQuestionnaire>>(`${environment.apiUrl}/api/questionnaires`, {
      params: params
    })
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  findQuestionnairesByUserId(userId: number, page?: number, size?: number): Observable<PagedResponse<IQuestionnaire>> {
    return this.http.get<PagedResponse<IQuestionnaire>>(`${environment.apiUrl}/api/users/${userId}/questionnaires`, {
      params: ParamsHelper.addPageAndSize(new HttpParams(), page, size)
    })
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  addQuestionnaireByUserId(userId: number, questionnaire: QuestionnaireRequest): Observable<IQuestionnaire> {
    return this.http.post<IQuestionnaire>(`${environment.apiUrl}/api/users/${userId}/questionnaires`, questionnaire)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  editQuestionnaireById(questionnaireId: number, questionnaire: QuestionnaireRequest): Observable<IQuestionnaire> {
    return this.http.put<IQuestionnaire>(`${environment.apiUrl}/api/questionnaires/${questionnaireId}`, questionnaire)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  deleteQuestionnaireById(questionnaireId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/questionnaires/${questionnaireId}`)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }
}
