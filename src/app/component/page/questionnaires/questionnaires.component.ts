import {Component, OnInit} from '@angular/core';
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {IQuestionnaire} from "../../../model/questionnaire/IQuestionnaire";
import {QuestionnaireService} from "../../../service/questionnaire.service";
import {ActivatedRoute, Params} from "@angular/router";
import {QuestionnaireFilter} from "../../../model/QuestionnaireFilter";

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.css']
})
export class QuestionnairesComponent implements OnInit {
  path: string
  questionnaires: PagedResponse<IQuestionnaire> = new class implements PagedResponse<IQuestionnaire> {
    content: IQuestionnaire[] = []
    metadata: Metadata
  }

  constructor(private questionnaireService: QuestionnaireService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.path = window.location.pathname
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.questionnaireService.findActiveQuestionnaires(this.buildFilterFromQueryParams(params),
        params?.['page'], params?.['size'])
        .subscribe((response: PagedResponse<IQuestionnaire>) => this.questionnaires = response)
    })
  }

  buildFilterFromQueryParams(params: Params): QuestionnaireFilter {
    const filter = new QuestionnaireFilter()
    filter.ownerEmail = params['ownerEmail'] ? params['ownerEmail'] : ''
    filter.title = params['title'] ? params['title'] : ''
    return filter
  }
}
