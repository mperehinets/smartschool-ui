import {AuthService} from '../shared/service/auth.service';

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoginSubject.getValue()) {
      this.authService.signOut();
    }
    return true;
  }
}
