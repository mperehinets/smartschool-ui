import {AppConstants} from '../app-constants';
import {NotificationService} from '../service/notification.service';

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';

@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {

  constructor(private notification: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = localStorage.getItem(AppConstants.LANGUAGE_STORAGE_KEY);
    let apiReq;
    req.url.includes('assets/i18n') ? apiReq = req : apiReq = req.clone({url: environment.apiUrl + req.url + '?lang=' + lang});
    return next.handle(apiReq).pipe(
      catchError(err => {
        if (err.error?.errors) {
          this.notification.showErrorMsg(err.error.errors);
        } else {
          this.notification.showErrorTranslateMsg('UNKNOWN-ERROR');
        }
        return throwError(err);
      })
    );
  }
}
