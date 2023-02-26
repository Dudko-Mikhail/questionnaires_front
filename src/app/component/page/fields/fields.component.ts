import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldService} from "../../../service/field.service";
import {Metadata, PagedResponse} from "../../../model/PagedResponse";
import {ActivatedRoute, Params} from "@angular/router";
import {AddEditFieldComponent} from "../../modal/add-edit-field/add-edit-field.component";
import {ModalService} from "../../../service/modal.service";
import {FieldResponse} from "../../../model/field/FieldResponse";

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {
  path: string
  fields: PagedResponse<FieldResponse> = new class implements PagedResponse<FieldResponse> {
    content: FieldResponse[] = []
    metadata: Metadata
  }
  @ViewChild('editFieldModal', {static: false}) editFieldComponent: AddEditFieldComponent

  constructor(private fieldService: FieldService, private activeRoute: ActivatedRoute,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.path = window.location.pathname
    this.activeRoute.queryParams.subscribe((params: Params) => {
      const pageParam: number = params['page']
      const sizeParam: number = params['size']
      this.fieldService.findSessionUserFields(pageParam, sizeParam)
        .subscribe(((response: PagedResponse<FieldResponse>) => {
            this.fields = response
          })
        )
    })
  }

  deleteField(id: number): void {
    this.fieldService.deleteFieldById(id)
      .subscribe(() => {
          window.location.reload()
        }
      )
  }

  prepareEditComponent(field: FieldResponse): void {
    this.editFieldComponent.fieldId = field.id
    this.editFieldComponent.fillFormWithFieldData(field)
    this.modalService.openModal('editField')
  }
}
