import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Credentials} from "../model/Credentials";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, Observable, retry, Subject, throwError} from "rxjs";
import {AuthenticationResponse} from "../model/AuthenticationResponse";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private static TOKEN_KEY = 'token'
  private static USER_ID_KEY = 'id'
  private authentication$: Subject<boolean> = new BehaviorSubject(false)
  token: string | null = null
  userId: number | null = null

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.sessionLogin()
    if (!this.isAuthenticated()) {
      this.rememberMeLogin()
    }
  }

  logIn(credentials: Credentials, rememberMe: boolean): Subject<void> {
    const subject: Subject<void> = new Subject()
    this.http.post<AuthenticationResponse>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(
        retry(3),
        catchError(this.handleError.bind(this))
      )
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
          subject.next()
        },
        error: (err: HttpErrorResponse) => {
          subject.error(err)
        }
      })
    return subject
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    this.errorService.handleServerAndUnknownErrors(err)
    return throwError(() => err)
  }

  rememberMeLogin(): void {
    const token = localStorage.getItem(AuthenticationService.TOKEN_KEY)
    const id = localStorage.getItem(AuthenticationService.USER_ID_KEY)
    if (id && token) {
      this.token = token
      this.userId = +id
      this.authentication$.next(true)
    }
  }

  sessionLogin(): void {
    const token = sessionStorage.getItem(AuthenticationService.TOKEN_KEY)
    const id = sessionStorage.getItem(AuthenticationService.USER_ID_KEY)
    if (id && token) {
      this.token = token
      this.userId = +id
      this.authentication$.next(true)
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
