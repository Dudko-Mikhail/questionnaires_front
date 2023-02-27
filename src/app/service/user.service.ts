import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {catchError, map, Observable, retry} from "rxjs";
import {IUser} from "../model/user/IUser";
import {environment} from "../../environments/environment";
import {User} from "../model/user/User";
import {AuthenticationService} from "./authentication.service";
import {ErrorService} from "./error.service";
import {ServiceErrorHandler} from "./serviceErrorHandler";
import {VerificationRequest} from "../model/VerificationRequest";
import {PasswordRecoveryRequest} from "../model/PasswordRecoveryRequest";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceErrorHandler {
  constructor(errorService: ErrorService, private http: HttpClient, private auth: AuthenticationService) {
    super(errorService)
  }

  findUserById(userId: number): Observable<User> {
    return this.http.get<IUser>(`${environment.apiUrl}/api/users/${userId}`)
      .pipe(
        retry(3),
        map(this.mapUser),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  editProfile(data: any): Observable<User> {
    return this.http.put<IUser>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}`, data)
      .pipe(
        retry(3),
        map(this.mapUser),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  signUp(data: IUser): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/sign-up`, data)
      .pipe(
        retry(3),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  sendVerificationMessage(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/verification-message`, {email: email})
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  sendResetPasswordMessage(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/reset-password-message`, {email: email})
      .pipe(
        retry(3),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  changePassword(data: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}/password`, data)
      .pipe(
        retry(3),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  resetPassword(passwordRecoveryRequest: PasswordRecoveryRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/password/recovery`, passwordRecoveryRequest)
      .pipe(
        retry(3),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  validateVerificationCode(verificationRequest: VerificationRequest): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/api/users/verification-code`, verificationRequest)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  activateAccount(verificationRequest: VerificationRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/email/verification`, verificationRequest)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  private mapUser(userInfo: IUser): User {
    return new User(userInfo)
  }
}
