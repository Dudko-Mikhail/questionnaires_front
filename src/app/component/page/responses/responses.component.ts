import {Component, OnInit} from '@angular/core';
import {FieldResponse} from "../../../model/field/FieldResponse";
import {PagedResponse} from "../../../model/PagedResponse";
import {QuestionnaireResponse} from "../../../model/QuestionnaireResponse";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs";
import {FieldService} from "../../../service/field.service";

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css']
})
export class ResponsesComponent implements OnInit {
  path: string
  fields: FieldResponse[] = []
  responses: PagedResponse<QuestionnaireResponse>

  constructor(private activatedRoute: ActivatedRoute, private fieldsService: FieldService) {
  }

  ngOnInit(): void {
    this.fieldsService.findAllQuestionnaireFields(this.activatedRoute.snapshot.params?.['id'])
      .subscribe((fields: FieldResponse[]) => this.fields = fields)
    this.activatedRoute.data.pipe(map(data => data?.['responses']))
      .subscribe((responses: PagedResponse<QuestionnaireResponse>) => this.responses = responses)
  }
}
