import {Component, OnInit} from '@angular/core';
import {FieldService} from "../../../service/field.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FieldResponse} from "../../../model/field/FieldResponse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResponseService} from "../../../service/response.service";
import {HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IQuestionnaire} from "../../../model/questionnaire/IQuestionnaire";
import {map} from "rxjs";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  private id: number
  fields: FieldResponse[] = []
  questionnaire: IQuestionnaire
  questionnaireForm: FormGroup

  constructor(private filedService: FieldService, private activateRoute: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder, private responseService: ResponseService) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params?.['id']
    this.activateRoute.data.pipe(map(data => data?.['questionnaire']))
      .subscribe((questionnaire: IQuestionnaire) => this.questionnaire = questionnaire)
    this.filedService.findAllQuestionnaireFields(this.id)
      .subscribe({
        next: fields => {
          this.fields = fields.filter(field => field.isActive)
          this.buildForm()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.toQuestionnaires()
          }
        }
      })
  }

  buildForm(): void {
    const controls: any = {}
    this.fields.forEach((field: FieldResponse) => {
      controls[field.id] = this.formBuilder.control('', field.isRequired ? Validators.required : [])
    })
    this.questionnaireForm = this.formBuilder.group(controls)
  }

  submit(): void {
    this.responseService.sendResponse(this.id, this.questionnaireForm.value)
      .subscribe(() => {
        sessionStorage.setItem(environment.congratulationPermissionStorageKey, 'ok')
        this.router.navigate(['congratulations'])
      })
  }

  toQuestionnaires(): void {
    this.router.navigate(['questionnaires'])
  }
}
