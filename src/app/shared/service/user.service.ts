import {User} from '../model/User';
import {ModelStatus} from '../model/ModelStatus';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  create(user: User): Observable<User> {
    return this.httpClient.post<User>(`/users`, user);
  }

  update(user: User): Observable<User> {
    return this.httpClient.put<User>(`/users/${user.id}`, user);
  }

  findAll(): Observable<User[]> {
    return this.httpClient.get<User[]>('/users');
  }

  updateAvatar(body: { id: number, newAvatarName: string }): Observable<void> {
    return this.httpClient.put<void>(`/users/update-avatar/${body.id}`, body);
  }

  resetPasswordByAdmin(body: { id: number, newPassword: string }): Observable<void> {
    return this.httpClient.put<void>(`/users/reset-password-by-admin/${body.id}`, body);
  }

  changeStatusById(id: number, status: ModelStatus): Observable<void> {
    if (status === ModelStatus.ACTIVE) {
      return this.httpClient.put<void>(`/users/activate/${id}`, null);
    } else if (status === ModelStatus.NOT_ACTIVE) {
      return this.httpClient.put<void>(`/users/deactivate/${id}`, null);
    } else {
      return this.httpClient.delete<void>(`/users/${id}`);
    }
  }

  giveAdminById(id: number): Observable<User> {
    return this.httpClient.put<User>(`/users/give-admin/${id}`, null);
  }

  takeAdminAwayById(id: number): Observable<User> {
    return this.httpClient.put<User>(`/users/take-admin-away/${id}`, null);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`/users/count`);
  }
}
