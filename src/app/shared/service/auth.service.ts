import {UserPrinciple} from '../model/UserPrinciple';
import {AppConstants} from '../app-constants';
import {User} from '../model/User';
import {NotificationService} from './notification.service';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoginSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient,
              private router: Router,
              private notification: NotificationService
  ) {
    this.isLoginSubject = new BehaviorSubject<boolean>(localStorage.getItem(AppConstants.JWT_STORAGE_KEY) !== null);
  }

  get userPrinciple(): UserPrinciple {
    try {
      return jwt_decode(localStorage.getItem(AppConstants.JWT_STORAGE_KEY));
    } catch (e) {
      this.signOut();
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`/users/${this.userPrinciple.id}`);
  }

  signIn(authenticationBody: { email: string, password: string }): void {
    this.http.post<{ token: string }>('/auth/login', authenticationBody).subscribe(
      res => {
        localStorage.setItem(AppConstants.JWT_STORAGE_KEY, res.token);
        this.isLoginSubject.next(true);
        if (this.userPrinciple.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        }
        this.notification.showSuccessTranslateMsg('LOGIN.SUCCESS-LOGIN');
      }
    );
  }

  signOut() {
    this.isLoginSubject.next(false);
    localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
    this.router.navigate(['auth/login']);
  }
}
