import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, retry, Subject} from "rxjs";
import {ErrorService} from "./error.service";
import {environment} from "../../environments/environment";
import {ServiceErrorHandler} from "./serviceErrorHandler";
import {PagedResponse} from "../model/PagedResponse";
import {QuestionnaireResponse} from "../model/QuestionnaireResponse";

// @ts-ignore
import SockJS from "sockjs-client/dist/sockjs"
import {Stomp} from "@stomp/stompjs";
import {ParamsHelper} from "../util/ParamsHelper";

@Injectable({
  providedIn: 'root'
})
export class ResponseService extends ServiceErrorHandler {
  private static WS_URL = `${environment.apiUrl}/ws`
  private insertEvents: Subject<void> = new Subject();
  private stompClient;

  constructor(errorService: ErrorService, private http: HttpClient) {
    super(errorService)

    const ws = new SockJS(ResponseService.WS_URL);
    this.stompClient = Stomp.over(() => ws);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/responses', (message) => {
        this.insertEvents.next();
      });
    });
  }

  public listenInsertEvents(): Observable<void> {
    return this.insertEvents;
  }

  sendResponse(questionnaireId: number, answer: QuestionnaireResponse): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/questionnaires/${questionnaireId}/responses`,
      {answer: answer})
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  findAllResponsesByQuestionnaireId(questionnaireId: number, page?: number, size?: number): Observable<PagedResponse<QuestionnaireResponse>> {
    return this.http.get<PagedResponse<QuestionnaireResponse>>(
      `${environment.apiUrl}/api/questionnaires/${questionnaireId}/responses`, {
        params: ParamsHelper.addPageAndSize(new HttpParams(), page, size)
      })
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }
}
