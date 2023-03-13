import {Component, Input} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {IQuestionnaire} from "../../../model/questionnaire/IQuestionnaire";
import {QuestionnaireService} from "../../../service/questionnaire.service";
import {QuestionnaireRequest} from "../../../model/questionnaire/QuestionnaireRequest";
import {AuthenticationService} from "../../../service/authentication.service";

@Component({
  selector: 'app-add-edit-questionnaire',
  templateUrl: './add-edit-questionnaire.component.html',
  styleUrls: ['./add-edit-questionnaire.component.css']
})
export class AddEditQuestionnaireComponent {
  questionnaireId: number
  @Input() modalId: string
  @Input() isAddQuestionnaire: boolean
  questionnaireForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    isActive: [false, Validators.required]
  })

  constructor(private formBuilder: FormBuilder, private questionnaireService: QuestionnaireService,
              private auth: AuthenticationService) {
  }

  get title() {
    return this.questionnaireForm.controls['title']
  }

  get description() {
    return this.questionnaireForm.controls['description']
  }

  get isActive() {
    return this.questionnaireForm.controls['isActive']
  }

  submit(): void {
    if (this.isAddQuestionnaire) {
      this.addQuestionnaire();
    } else {
      this.editQuestionnaire();
    }
  }

  addQuestionnaire(): void {
    this.questionnaireService.addQuestionnaireByUserId(this.auth.getUserId(), this.mapFormDataToQuestionnaireRequest())
      .subscribe(() => window.location.reload())
  }

  editQuestionnaire(): void {
    this.questionnaireService.editQuestionnaireById(this.questionnaireId, this.mapFormDataToQuestionnaireRequest())
      .subscribe(() => window.location.reload())
  }

  mapFormDataToQuestionnaireRequest(): QuestionnaireRequest {
    const title = this.title.value ? this.title.value : '';
    const isActive = this.isActive.value !== null ? this.isActive.value : true
    return new QuestionnaireRequest(title, this.description.value, isActive)
  }

  fillFormWithQuestionnaireData(questionnaire: IQuestionnaire) {
    this.title.setValue(questionnaire.title)
    this.description.setValue(questionnaire.description)
  }
}
