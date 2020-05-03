import {AuthService} from '../shared/service/auth.service';

import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthService) {
  }

  canLoad(route: Route): boolean {
    return this.condition();
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.condition();
  }

  private condition(): boolean {
    if (this.authService.userPrinciple.roles.includes('ROLE_ADMIN')) {
      this.authService.currentRole = 'ROLE_ADMIN';
      return true;
    } else {
      this.authService.openChooseRoleDialog();
    }
  }
}
