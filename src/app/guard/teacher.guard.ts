import {AuthService} from '../shared/service/auth.service';

import {CanLoad, Route, Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canLoad(route: Route): boolean {
    return this.authService.userPrinciple.roles.includes('ROLE_TEACHER');
  }
}
