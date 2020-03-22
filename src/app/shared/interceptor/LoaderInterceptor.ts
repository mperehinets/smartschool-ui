import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from '../service/loader.service';
import {finalize} from 'rxjs/operators';
import {AppConstants} from '../app-constants';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(AppConstants.BASE_URL)) {
      this.loaderService.show();
    }
    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

}
