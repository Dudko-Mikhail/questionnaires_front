import {Component, OnInit} from '@angular/core';
import {FieldService} from "../../../service/field.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FieldResponse} from "../../../model/field/FieldResponse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResponseService} from "../../../service/response.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  private id: number
  fields: FieldResponse[] = []
  questionnaireForm: FormGroup

  constructor(private filedService: FieldService, private activateRoute: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder, private responseService: ResponseService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      this.id = params['id']
      this.filedService.findAllUserFields(this.id)
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
      .subscribe(() => this.router.navigate(['congratulations']))
  }

  reset(): void {
    this.questionnaireForm.reset()
  }

  toQuestionnaires(): void {
    this.router.navigate(['questionnaires'])
  }
}
