import {User} from '../model/User';
import {ModelStatus} from '../model/ModelStatus';
import {compareValidator} from '../validator/CompareValidator';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userForm: FormGroup;
  resetPasswordForm: FormGroup;
  updateAvatarForm: FormGroup;

  constructor(private httpClient: HttpClient) {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('',
        [
          Validators.pattern('[A-Za-zА-Яа-яіІ\\- ]{3,60}')
        ]),
      secondName: new FormControl('',
        [
          Validators.pattern('[A-Za-zА-Яа-яіІ\\- ]{3,60}')
        ]),
      dateBirth: new FormControl(''),
      avatarName: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
      confirmPassword: new FormControl('', compareValidator('password'))
    });

    this.resetPasswordForm = new FormGroup({
      id: new FormControl(''),
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', compareValidator('newPassword'))
    });

    this.updateAvatarForm = new FormGroup({
      id: new FormControl(''),
      newAvatarName: new FormControl('')
    });
  }

  populateUserForm(user: User) {
    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      dateBirth: user.dateBirth,
      avatarName: user.avatarName,
      email: user.email,
      password: 'password',
      confirmPassword: 'password'
    });
  }

  populateResetPasswordForm(user: User) {
    this.resetPasswordForm.patchValue({
      id: user.id
    });
  }

  populateUpdateAvatarForm(user: User) {
    this.updateAvatarForm.patchValue({
      id: user.id,
      newAvatarName: user.avatarName
    });
  }

  create(): Observable<User> {
    return this.httpClient.post<User>(`/users`, this.userForm.value);
  }

  update(): Observable<User> {
    return this.httpClient.put<User>(`/users/${this.userForm.value.id}`, this.userForm.value);
  }

  findAll(): Observable<User[]> {
    return this.httpClient.get<User[]>('/users');
  }

  findById(id: number): Observable<User> {
    return this.httpClient.get<User>(`/users/${id}`);
  }

  updateAvatar(): Observable<User> {
    return this.httpClient.put<User>(`/users/update-avatar/${this.updateAvatarForm.value.id}`, this.updateAvatarForm.value);
  }

  resetPasswordByAdmin(): Observable<User> {
    console.log(this.resetPasswordForm.value);
    return this.httpClient.put<User>(`/users/reset-password-by-admin/${this.resetPasswordForm.value.id}`, this.resetPasswordForm.value);
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
