import {UserPrinciple} from '../model/UserPrinciple';
import {AppConstants} from '../app-constants';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  signIn(authenticationBody: { email, password }) {
    return this.http.post<any>('/auth/login', authenticationBody);
  }

  signOut() {
    localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
    this.router.navigate(['auth/login']);
  }

  get userPrinciple(): UserPrinciple {
    try {
      return jwt_decode(localStorage.getItem(AppConstants.JWT_STORAGE_KEY));
    } catch (e) {
      localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
      this.router.navigate(['/auth/login']);
    }
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem(AppConstants.JWT_STORAGE_KEY);
    return (authToken !== null);
  }
}
