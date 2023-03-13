import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FieldService} from "../../../service/field.service";
import {FieldRequest} from "../../../model/field/FieldRequest";
import {FieldResponse} from "../../../model/field/FieldResponse";
import {FieldTypeRegistry} from "../../../service/field-type-registry.service";
import {FieldType} from "../../../model/field/type/FieldType";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-edit-field',
  templateUrl: './add-edit-field.component.html',
  styleUrls: ['./add-edit-field.component.css']
})
export class AddEditFieldComponent implements OnInit {
  fieldId: number
  questionnaireId: number
  @Input() modalId: string
  @Input() isAddField: boolean
  types: Set<FieldType> = new Set<FieldType>()
  fieldForm: FormGroup
  addNewOptionForm: FormGroup

  constructor(private formBuilder: FormBuilder, private fieldService: FieldService,
              private fieldTypeRegistry: FieldTypeRegistry, private activatedRoute: ActivatedRoute) {
  }

  get label() {
    return this.fieldForm.controls['label']
  }

  get type() {
    return this.fieldForm.controls['type']
  }

  get required() {
    return this.fieldForm.controls['required']
  }

  get active() {
    return this.fieldForm.controls['active']
  }

  get options() {
    return this.fieldForm.controls['options'] as FormArray
  }

  get newOption() {
    return this.addNewOptionForm.controls['newOption']
  }

  ngOnInit(): void {
    this.questionnaireId = this.activatedRoute.snapshot.params?.['id']
    this.fieldService.findAllFieldTypes()
      .subscribe((types: Set<FieldType>) => this.types = types)
    this.fieldForm = this.formBuilder.group({
      label: ['', [Validators.required, Validators.maxLength(128)]],
      type: ['', Validators.required],
      options: this.formBuilder.array([]),
      required: [false],
      active: [false]
    })

    this.addNewOptionForm = this.formBuilder.group({
      newOption: ['', [Validators.maxLength(64)]]
    })

    this.fieldForm.controls['type'].valueChanges
      .subscribe(value => {
        if (this.hasOptions(value)) {
          this.options.setValidators(Validators.required)
        } else {
          this.options.clear()
          this.options.clearValidators()
        }
        this.options.updateValueAndValidity()
      })
  }

  submit(): void {
    if (this.fieldForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    if (this.isAddField) {
      this.addField()
    } else {
      this.editField()
    }
  }

  hasOptions(fileType: string): boolean {
    if (!fileType) {
      return false
    }
    return this.fieldTypeRegistry.parseFieldType(fileType).hasOptions()
  }

  addField(): void {
    this.fieldService.addField(this.questionnaireId, this.convertFormDataIntoField())
      .subscribe(() => window.location.reload())
  }

  editField(): void {
    const field: FieldRequest = this.convertFormDataIntoField()
    this.fieldService.editField(this.fieldId, field)
      .subscribe(() => window.location.reload())
  }

  fillFormWithFieldData(field: FieldResponse): void {
    this.active.setValue(field.isActive)
    this.required.setValue(field.isRequired)
    this.label.setValue(field.label)
    if (field.options) {
      field.options.forEach(option => this.addOptionToArray(option))
    }
    this.type.setValue(field.type.apiName())
  }

  convertFormDataIntoField(): FieldRequest {
    return {
      label: this.label.value,
      type: this.type.value,
      options: this.options.value.length != 0 ? this.options.value : null,
      isRequired: this.required.value,
      isActive: this.active.value
    } as FieldRequest
  }

  addOption(): void {
    if (this.newOption.valid) {
      this.addOptionToArray(this.newOption.value)
      this.newOption.setValue('')
      this.newOption.removeValidators(Validators.required)
      this.newOption.updateValueAndValidity()
      this.addNewOptionForm.reset()
    }
  }

  private addOptionToArray(value: string) {
    if (value) {
      this.options.push(this.formBuilder.control(value, Validators.maxLength(64)))
    }
  }

  removeIfEmpty(event: Event, optionIndex: number) {
    const targetInput = event.target as HTMLInputElement
    if (targetInput.value === '') {
      this.options.removeAt(optionIndex)
    }
  }
}
