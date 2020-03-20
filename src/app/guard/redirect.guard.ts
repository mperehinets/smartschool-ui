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
      this.router.navigate(['/admin/users']);
    }
    return true;
  }

}
