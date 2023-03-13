import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldService} from "../../../service/field.service";
import {PagedResponse} from "../../../model/PagedResponse";
import {ActivatedRoute} from "@angular/router";
import {AddEditFieldComponent} from "../../modal/add-edit-field/add-edit-field.component";
import {ModalService} from "../../../service/modal.service";
import {FieldResponse} from "../../../model/field/FieldResponse";
import {map} from "rxjs";

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {
  path: string
  fields: PagedResponse<FieldResponse>
  @ViewChild('editFieldModal', {static: false}) editFieldComponent: AddEditFieldComponent

  constructor(private fieldService: FieldService, private activatedRoute: ActivatedRoute,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.path = window.location.pathname
    this.activatedRoute.data.pipe(
      map(data => data?.['fields'])
    ).subscribe(
      (fields: PagedResponse<FieldResponse>) => {
        this.fields = fields
      }
    )
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
