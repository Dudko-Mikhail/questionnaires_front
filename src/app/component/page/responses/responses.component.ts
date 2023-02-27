import {Component, OnInit} from '@angular/core';
import {FieldResponse} from "../../../model/field/FieldResponse";
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {FieldService} from "../../../service/field.service";
import {ResponseService} from "../../../service/response.service";
import {QuestionnaireResponse} from "../../../model/QuestionnaireResponse";
import {AuthenticationService} from "../../../service/authentication.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css']
})
export class ResponsesComponent implements OnInit {
  path: string
  fields: FieldResponse[] = []
  responses: PagedResponse<QuestionnaireResponse> = new class implements PagedResponse<any> {
    content: QuestionnaireResponse[] = [];
    metadata: Metadata;
  }

  constructor(private fieldsService: FieldService, private responseService: ResponseService,
              private auth: AuthenticationService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.path = window.location.pathname
    this.fieldsService.findAllUserFields(this.auth.getUserId())
      .subscribe((fields: FieldResponse[]) => this.fields = fields)

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const pageParam: number = params['page']
      const sizeParam: number = params['size']
      this.responseService.findAllResponsesByUserId(this.auth.getUserId(), pageParam, sizeParam)
        .subscribe((response: PagedResponse<QuestionnaireResponse>) => this.responses = response)

      this.responseService.listenInsertEvents()
        .subscribe(() => {
            this.responseService.findAllResponsesByUserId(this.auth.getUserId(), pageParam, sizeParam)
              .subscribe((response: PagedResponse<QuestionnaireResponse>) => this.responses = response)

          }
        )
    })
  }
}
