import {ResetPassword} from '../model/ResetPassword';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) {
  }

  resetPassword(resetPassword: ResetPassword): Observable<void> {
    let params = new HttpParams();
    params = params.append('email', resetPassword.userEmail);
    return this.http.post<void>(`/passwords/reset`, resetPassword, {params});
  }

  resetPasswordWithChecking(resetPassword: ResetPassword): Observable<void> {
    let params = new HttpParams();
    params = params.append('email', resetPassword.userEmail);
    return this.http.post<void>(`/passwords/reset-with-checking`, resetPassword, {params});
  }

  sendResetToken(email: string): Observable<void> {
    let params = new HttpParams();
    params = params.append('email', email);
    return this.http.post<void>('/passwords/send-reset-token', null, {params});
  }
}
