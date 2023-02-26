import {Component, OnInit} from '@angular/core';
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {IQuestionnaire} from "../../../model/IQuestionnaire";
import {QuestionnaireService} from "../../../service/questionnaire.service";
import {ActivatedRoute, Params} from "@angular/router";

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
      const pageParam: number = params['page']
      const sizeParam: number = params['size']
      this.questionnaireService.findQuestionnaires(pageParam, sizeParam)
        .subscribe((response: PagedResponse<IQuestionnaire>) => this.questionnaires = response)
    })
  }
}
