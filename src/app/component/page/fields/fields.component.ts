import {Component, OnInit} from '@angular/core';
import {Field} from "../../../model/Field";
import {FieldService} from "../../../service/field.service";
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {
  path: string
  fields: PagedResponse<Field> = new class implements PagedResponse<Field> {
    content: Field[] = [];
    metadata: Metadata;
  }

  constructor(private fieldService: FieldService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.path = window.location.pathname
    this.activeRoute.queryParams.subscribe((params: Params) => {
      const pageParam: number = params['page']
      const sizeParam: number = params['size']
      this.fieldService.findSessionUserFields(pageParam, sizeParam)
        .subscribe(((response: PagedResponse<Field>) => {
            this.fields = response;
          })
        );
    })
  }

  deleteField(id: number): void {
    this.fieldService.deleteFieldById(99)
      .subscribe({
        next: () => {
          window.location.reload()
        },
        error: (err) => alert(JSON.stringify(err))
      })
  }

  editField(id: number): void {
    alert(id)
  }


}
