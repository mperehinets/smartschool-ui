import {AuthService} from '../shared/service/auth.service';

import {CanLoad, Route} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(private authService: AuthService) {
  }

  canLoad(route: Route): boolean {
    return this.authService.userPrinciple.roles.includes('ROLE_ADMIN');
  }
}
