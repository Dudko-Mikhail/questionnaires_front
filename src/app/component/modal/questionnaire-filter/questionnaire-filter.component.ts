import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-questionnaire-filter',
  templateUrl: './questionnaire-filter.component.html',
  styleUrls: ['./questionnaire-filter.component.css']
})
export class QuestionnaireFilterComponent implements OnInit {
  @Input() modalId: string
  filterForm: FormGroup = this.formBuilder.group({
    title: ['', Validators.maxLength(255)],
    ownerEmail: ['', Validators.maxLength(64)]
  })

  constructor(private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
  }

  get title() {
    return this.filterForm.controls['title']
  }

  get ownerEmail() {
    return this.filterForm.controls['ownerEmail']
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.title.setValue(params?.['title'])
      this.ownerEmail.setValue(params?.['ownerEmail'])
    })
  }


  submit(): void {
    if (this.filterForm.invalid) {
      alert('The form is filled with invalid data')
      return
    }
    this.router.navigate(['questionnaires'], {
      queryParams: {title: this.title.value, ownerEmail: this.ownerEmail.value},
      queryParamsHandling: 'merge'
    })
  }
}
