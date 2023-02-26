import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.css']
})
export class CongratulationsComponent {
  constructor(private router: Router) {
  }

  toQuestionnaires(): void {
    this.router.navigate(['questionnaires'])
  }
}
