import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {map, Observable, retry} from "rxjs";
import {IUser} from "../model/user/IUser";
import {environment} from "../../environments/environment";
import {User} from "../model/user/User";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth: AuthenticationService) {
  }

  findUserById(userId: number): Observable<User> {
    return this.http.get<IUser>(`${environment.apiUrl}/api/users/${userId}`)
      .pipe(retry(3),
        map(this.mapUser)
      )
  }

  editProfile(data: any): Observable<User> {
    return this.http.put<IUser>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}`, data)
      .pipe(
        retry(3),
        map(this.mapUser)
      )
  }

  private mapUser(userInfo: IUser): User {
    return new User(userInfo)
  }
}