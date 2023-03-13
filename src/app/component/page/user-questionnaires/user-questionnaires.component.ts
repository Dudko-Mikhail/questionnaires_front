import {Component, OnInit, ViewChild} from '@angular/core';
import {QuestionnaireService} from "../../../service/questionnaire.service";
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {IQuestionnaire} from "../../../model/questionnaire/IQuestionnaire";
import {AuthenticationService} from "../../../service/authentication.service";
import {ModalService} from "../../../service/modal.service";
import {AddEditQuestionnaireComponent} from "../../modal/add-edit-questionnaire/add-edit-questionnaire.component";

@Component({
  selector: 'app-user-questionnaires',
  templateUrl: './user-questionnaires.component.html',
  styleUrls: ['./user-questionnaires.component.css']
})
export class UserQuestionnairesComponent implements OnInit {
  path: string
  @ViewChild('editQuestionnaireModal', {static: false}) editQuestionnaireComponent: AddEditQuestionnaireComponent
  questionnaires: PagedResponse<IQuestionnaire> = new class implements PagedResponse<IQuestionnaire> {
    content: IQuestionnaire[] = []
    metadata: Metadata
  };

  constructor(private questionnaireService: QuestionnaireService, private auth: AuthenticationService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    const userId: number = this.auth.getUserId();
    this.path = window.location.pathname
    this.questionnaireService.findQuestionnairesByUserId(userId)
      .subscribe((questionnaires: PagedResponse<IQuestionnaire>) => {
        this.questionnaires = questionnaires
      })
  }

  prepareEditComponent(questionnaire: IQuestionnaire) {
    this.editQuestionnaireComponent.questionnaireId = questionnaire.id
    this.editQuestionnaireComponent.fillFormWithQuestionnaireData(questionnaire)
    this.modalService.openModal('editQuestionnaire')
  }

  deleteQuestionnaire(id: number): void {
    this.questionnaireService.deleteQuestionnaireById(id)
      .subscribe(() => window.location.reload())
  }
}
