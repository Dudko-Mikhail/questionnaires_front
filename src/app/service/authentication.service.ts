import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../model/Credentials";
import {environment} from "../../environments/environment";
import {ReplaySubject, retry, Subject} from "rxjs";
import {AuthenticationResponse} from "../model/AuthenticationResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private static TOKEN_KEY = 'token'
  private static USER_ID_KEY = 'id'
  private authentication$: Subject<boolean> = new ReplaySubject()
  token: string | null = null
  userId: number | null = null

  constructor(private http: HttpClient) {
    this.sessionLogin()
    if (!this.isAuthenticated()) {
      this.rememberMeLogin()
    }
  }

  logIn(credentials: Credentials, rememberMe: boolean): Subject<boolean> {
    const subject: Subject<boolean> = new ReplaySubject<boolean>(1)
    this.http.post<AuthenticationResponse>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(retry(3))
      .subscribe({
        next: (response: AuthenticationResponse) => {
          this.token = response.token
          this.userId = response.userId
          if (rememberMe) {
            localStorage.setItem(AuthenticationService.USER_ID_KEY, this.userId.toString())
            localStorage.setItem(AuthenticationService.TOKEN_KEY, this.token)
          } else {
            sessionStorage.setItem(AuthenticationService.USER_ID_KEY, this.userId.toString())
            sessionStorage.setItem(AuthenticationService.TOKEN_KEY, this.token)
          }
          this.authentication$.next(true)
          subject.next(true)
        },
        error: err => subject.next(false)
      })
    return subject
  }

  rememberMeLogin(): void {
    const token = localStorage.getItem(AuthenticationService.TOKEN_KEY)
    const id = localStorage.getItem(AuthenticationService.USER_ID_KEY)
    if (id && token) {
      this.token = token
      this.userId = +id
    }
  }

  sessionLogin(): void {
    const token = sessionStorage.getItem(AuthenticationService.TOKEN_KEY)
    const id = sessionStorage.getItem(AuthenticationService.USER_ID_KEY)
    if (id && token) {
      this.token = token
      this.userId = +id
    }
  }

  logOut(): void {
    localStorage.removeItem(AuthenticationService.USER_ID_KEY)
    localStorage.removeItem(AuthenticationService.TOKEN_KEY)
    sessionStorage.removeItem(AuthenticationService.USER_ID_KEY)
    sessionStorage.removeItem(AuthenticationService.TOKEN_KEY)
    this.token = null
    this.userId = null
    this.authentication$.next(false)
  }

  isAuthenticated(): boolean {
    return this.userId != null && this.token != null
  }

  watchAuthenticated(): Subject<boolean> {
    return this.authentication$
  }

  getUserId(): number {
    return this.userId != null ? this.userId : -1
  }

  getAuthorizationHeaderValue(): string {
    return `Bearer ${this.token}`
  }
}
