import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user/User";
import {UserService} from "../../service/user.service";
import {ReplaySubject, Subject} from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private static DEFAULT_PROFILE_MENU_TITLE = 'Profile Menu'
  profileMenuTitle$: Subject<string> = new ReplaySubject(1)

  constructor(private auth: AuthenticationService, private userService: UserService) {
    if (!this.isAuthenticated()) {
      this.profileMenuTitle$.next(NavigationComponent.DEFAULT_PROFILE_MENU_TITLE)
      return
    }
    const userId = this.auth.getUserId()
    this.userService.findUserById(userId)
      .subscribe((user: User) => {
        this.profileMenuTitle$.next(user.getFullNameOrEmail())
      })
  }

  ngOnInit(): void {
    this.auth.watchAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.profileMenuTitle$.next(NavigationComponent.DEFAULT_PROFILE_MENU_TITLE)
          return
        }
        const userId = this.auth.getUserId()
        this.userService.findUserById(userId)
          .subscribe((user: User) => {
            this.profileMenuTitle$.next(user.getFullNameOrEmail())
          })
      }
    )
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated()
  }

  logOut(): void {
    this.auth.logOut()
    window.location.reload()
  }

  manageActiveStyle(): Subject<boolean> {
    let stream$ = new ReplaySubject<boolean>(1)
    const path = window.location.pathname
    if (path.includes('/profile')) {
      stream$.next(true)
    }
    return stream$
  }
}
