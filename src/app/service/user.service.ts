import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {catchError, EMPTY, map, Observable, retry, throwError} from "rxjs";
import {IUser} from "../model/user/IUser";
import {environment} from "../../environments/environment";
import {User} from "../model/user/User";
import {AuthenticationService} from "./authentication.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth: AuthenticationService, private errorService: ErrorService) {
  }

  findUserById(userId: number): Observable<User> {
    return this.http.get<IUser>(`${environment.apiUrl}/api/users/${userId}`)
      .pipe(
        retry(3),
        map(this.mapUser),
        catchError(this.handleError.bind(this))
      )
  }

  editProfile(data: any): Observable<User> {
    return this.http.put<IUser>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}`, data)
      .pipe(
        retry(3),
        map(this.mapUser),
        catchError(this.handleError.bind(this))
      )
  }

  signUp(data: IUser): Observable<void> {
    return this.http.post<string>(`${environment.apiUrl}/api/auth/sign-up`, data)
      .pipe(
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  sendVerificationMessage(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/verification-message`, {email: email})
      .pipe(
        retry(3),
        catchError((err: HttpErrorResponse) => {
          this.errorService.handleAllErrors(err)
          return EMPTY
        })
      )
  }

  private mapUser(userInfo: IUser): User {
    return new User(userInfo)
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    this.errorService.handleServerAndUnknownErrors(err)
    return throwError(() => err)
  }
}
