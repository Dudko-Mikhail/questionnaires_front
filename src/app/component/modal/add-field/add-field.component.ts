import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FieldType} from "../../../model/FieldType";
import {FieldService} from "../../../service/field.service";
import {Field} from "../../../model/Field";

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.css']
})
export class AddFieldComponent implements OnInit {
  @Input() modalId: string
  types: FieldType[] = [FieldType.CHECKBOX, FieldType.COMBOBOX, FieldType.DATE, FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT, FieldType.RADIO_BUTTON]
  addFieldForm: FormGroup
  addNewOptionForm: FormGroup

  constructor(private formBuilder: FormBuilder, private fieldService: FieldService, private router: Router) {
  }

  ngOnInit(): void {
    this.addFieldForm = this.formBuilder.group({
      label: ['', [Validators.required, Validators.maxLength(128)]],
      type: ['', Validators.required],
      options: this.formBuilder.array([]),
      required: [false],
      active: [false]
    })

    this.addNewOptionForm = this.formBuilder.group({
      newOption: ['', [Validators.maxLength(64)]]
    })

    this.addFieldForm.controls['type'].valueChanges
      .subscribe(value => {
        if ((value === FieldType.COMBOBOX) || (value === FieldType.RADIO_BUTTON)) {
          this.options.setValidators(Validators.required)
          if (this.options.length === 0) {
            this.newOption.addValidators(Validators.required)
            this.newOption.updateValueAndValidity()
          }
        } else {
          this.options.clearValidators()
        }
        this.options.updateValueAndValidity()
      })

    this.addNewOptionForm = this.formBuilder.group({
      newOption: ['', Validators.maxLength(64)]
    })
  }


  submit(): void { // todo implement
    if (this.addFieldForm.invalid) {
      alert("The form is filled with invalid data")
      return
    }
    this.fieldService.addField(this.addFieldForm.value)
      .subscribe((field: Field) => {
        this.router.navigate(['/fields'])
      })
  }

  addOption(): void {
    if (this.newOption.valid) {
      this.options.push(this.formBuilder.control(this.newOption.value, Validators.maxLength(64)))
      this.newOption.setValue('')
      this.newOption.removeValidators(Validators.required)
      this.newOption.updateValueAndValidity()
      this.addNewOptionForm.reset()
    }
  }

  removeIfEmpty(event: Event, optionIndex: number) {
    const targetInput = event.target as HTMLInputElement
    if (targetInput.value === '') {
      this.options.removeAt(optionIndex)
    }
  }

  get label() {
    return this.addFieldForm.controls['label']
  }

  get type() {
    return this.addFieldForm.controls['type']
  }

  get required() {
    return this.addFieldForm.controls['required']
  }

  get active() {
    return this.addFieldForm.controls['active']
  }

  get options() {
    return this.addFieldForm.controls['options'] as FormArray
  }

  get newOption() {
    return this.addNewOptionForm.controls['newOption']
  }
}
