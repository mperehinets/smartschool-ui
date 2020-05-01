import {AuthService} from '../shared/service/auth.service';

import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(): boolean {
    if (this.authService.userPrinciple.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['admin/home']);
    } else if (this.authService.userPrinciple.roles.includes('ROLE_TEACHER')) {
      this.router.navigate(['teacher']);
    } else if (this.authService.userPrinciple.roles.includes('ROLE_PUPIL')) {
      this.router.navigate(['pupil']);
    } else {
      this.router.navigate(['auth/login']);
    }
    return true;
  }

}
