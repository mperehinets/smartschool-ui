import {User} from '../model/User';
import {ModelStatus} from '../model/ModelStatus';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(`/users`, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`/users/${user.id}`, user);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>('/users');
  }

  updateAvatarForCurrent(newAvatarName: string): Observable<void> {
    return this.http.put<void>('/users/current/update-avatar', newAvatarName);
  }

  resetPassword(body: { id: number, newPassword: string }): Observable<void> {
    return this.http.put<void>(`/users/reset-password/${body.id}`, body);
  }

  changeStatusById(body: { id: number, newStatus: ModelStatus }): Observable<void> {
    return this.http.put<void>(`/users/change-status/${body.id}`, body);
  }

  giveAdminById(id: number): Observable<User> {
    return this.http.put<User>(`/users/give-admin/${id}`, null);
  }

  takeAdminAwayById(id: number): Observable<User> {
    return this.http.put<User>(`/users/take-admin-away/${id}`, null);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/users/count`);
  }
}
