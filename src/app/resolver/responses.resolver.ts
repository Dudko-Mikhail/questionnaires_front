import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject, switchMap} from 'rxjs';
import {PagedResponse} from "../model/PagedResponse";
import {QuestionnaireResponse} from "../model/QuestionnaireResponse";
import {ResponseService} from "../service/response.service";

@Injectable({
  providedIn: 'root'
})
export class ResponsesResolver implements Resolve<PagedResponse<QuestionnaireResponse>> {
  private responses$: Subject<PagedResponse<QuestionnaireResponse>> = new Subject();

  constructor(private responseService: ResponseService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<QuestionnaireResponse>> {
    this.responseService.findAllResponsesByQuestionnaireId(route.params?.['id'], route.queryParams?.['page'],
      route.queryParams?.['size'])
      .subscribe((responses: PagedResponse<QuestionnaireResponse>) => this.responses$.next(responses))

    this.responseService.listenInsertEvents()
      .pipe(
        switchMap(() => this.responseService.findAllResponsesByQuestionnaireId(route.params?.['id'],
          route.queryParams?.['page'], route.queryParams?.['size'])))
      .subscribe((response: PagedResponse<QuestionnaireResponse>) => this.responses$.next(response))
    return this.responses$
  }
}
