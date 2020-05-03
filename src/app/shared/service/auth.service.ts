import {UserPrinciple} from '../model/UserPrinciple';
import {AppConstants} from '../app-constants';
import {User} from '../model/User';
import {NotificationService} from './notification.service';
import {ChooseRoleComponent} from '../component/choose-role/choose-role.component';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoginSubject: BehaviorSubject<boolean>;
  currentRole = '';

  constructor(private http: HttpClient,
              private router: Router,
              private notification: NotificationService,
              private dialog: MatDialog
  ) {
    this.isLoginSubject = new BehaviorSubject<boolean>(localStorage.getItem(AppConstants.JWT_STORAGE_KEY) !== null);
  }

  get userPrinciple(): UserPrinciple {
    try {
      const userPrinciple = jwt_decode(localStorage.getItem(AppConstants.JWT_STORAGE_KEY));
      userPrinciple.roles = userPrinciple.roles.split(',');
      return userPrinciple;
    } catch (e) {
      this.signOut();
    }
  }

  get homeLink(): string {
    return this.currentRole === 'ROLE_ADMIN' ? '/admin/home' :
      this.currentRole === 'ROLE_TEACHER' ? '/teacher' :
        this.currentRole === 'ROLE_PUPIL' ? '/pupil' :
          '';
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`/users/${this.userPrinciple.id}`);
  }

  signIn(authenticationBody: { email: string, password: string }): void {
    this.http.post<{ token: string }>('/auth/login', authenticationBody).subscribe(
      res => {
        if (jwt_decode(res.token).roles.length === 0) {
          this.notification.showErrorTranslateMsg('LOGIN.WITHOUT-ROLES');
        } else {
          localStorage.setItem(AppConstants.JWT_STORAGE_KEY, res.token);
          if (this.userPrinciple.roles.length > 1) {
            this.openChooseRoleDialog();
          } else if (this.userPrinciple.roles.includes('ROLE_ADMIN')) {
            this.currentRole = 'ROLE_ADMIN';
            this.router.navigate(['/admin']);
          } else if (this.userPrinciple.roles.includes('ROLE_TEACHER')) {
            this.currentRole = 'ROLE_TEACHER';
            this.router.navigate(['/teacher']);
          } else if (this.userPrinciple.roles.includes('ROLE_PUPIL')) {
            this.currentRole = 'ROLE_PUPIL';
            this.router.navigate(['/pupil']);
          }
          this.isLoginSubject.next(true);
          this.notification.showSuccessTranslateMsg('LOGIN.SUCCESS-LOGIN');
        }
      }
    );
  }

  signOut() {
    this.isLoginSubject.next(false);
    this.currentRole = '';
    localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
    this.router.navigate(['auth/login']);
  }

  openChooseRoleDialog(): MatDialogRef<ChooseRoleComponent> {
    return this.dialog.open(ChooseRoleComponent, {
      data: this.userPrinciple.roles,
      disableClose: true,
      width: '300px',
      panelClass: ''
    });
  }
}
