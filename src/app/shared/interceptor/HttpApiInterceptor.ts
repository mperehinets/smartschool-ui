import {AppConstants} from '../app-constants';

import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class HttpApiInterceptor implements HttpApiInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = localStorage.getItem('lang');
    let apiReq;
    req.url.includes('assets/i18n') ? apiReq = req : apiReq = req.clone({url: AppConstants.BASE_URL + req.url + '?lang=' + lang});
    return next.handle(apiReq);
  }
}
