import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from '../service/loader.service';
import {finalize} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.apiUrl)) {
      this.loaderService.show();
    }
    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

}
