import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.css']
})
export class CongratulationsComponent implements OnDestroy, OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const key: string | null = sessionStorage.getItem(environment.congratulationPermissionStorageKey)
    if (key == null || key !== 'ok') {
      this.router.navigate(['questionnaires'])
    }
  }

  toQuestionnaires(): void {
    this.router.navigate(['questionnaires'])
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(environment.congratulationPermissionStorageKey)
  }
}
