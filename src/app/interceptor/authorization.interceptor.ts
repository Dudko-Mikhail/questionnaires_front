import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../service/authentication.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.auth.isAuthenticated()) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', this.auth.getAuthorizationHeaderValue())
      })
      return next.handle(authRequest)
    }
    return next.handle(request)
  }
}
