import {Component, OnInit} from '@angular/core';
import {ErrorService} from "../../service/error.service";

@Component({
  selector: 'app-unknown-error',
  templateUrl: './unknown-error.component.html',
  styleUrls: ['./unknown-error.component.css']
})
export class UnknownErrorComponent implements OnInit {
  message: string

  constructor(private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.errorService.message$.subscribe(
      (message: string) => {
        this.message = message
      }
    )
  }

  close(): void {
    this.errorService.clear()
  }
}
