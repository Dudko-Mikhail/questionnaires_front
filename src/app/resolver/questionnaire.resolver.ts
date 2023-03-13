import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IQuestionnaire} from "../model/questionnaire/IQuestionnaire";
import {QuestionnaireService} from "../service/questionnaire.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireResolver implements Resolve<IQuestionnaire> {
  constructor(private questionnaireService: QuestionnaireService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionnaire> {
    return this.questionnaireService.findQuestionnaireById(route.params?.['id'])
  }
}
