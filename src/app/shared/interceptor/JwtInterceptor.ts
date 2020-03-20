import {AppConstants} from '../app-constants';
import {AuthService} from '../service/auth.service';

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem(AppConstants.JWT_STORAGE_KEY);
    return next.handle(req.clone({headers: req.headers.set('Authorization', `${jwt}`)})).pipe(
      catchError(err => {
        if (err.status === 403) {
          this.authService.signOut();
        }
        return throwError(err);
      })
    );
  }

}
