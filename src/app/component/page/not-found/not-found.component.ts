import {Component} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private auth: AuthenticationService, private router: Router) {
  }

  goHome(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['user/questionnaires'])
      return
    }
    this.router.navigate(['questionnaires'])
  }
}
