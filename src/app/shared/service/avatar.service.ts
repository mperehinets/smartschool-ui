import {AppConstants} from '../app-constants';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private http: HttpClient) {
  }

  getUrlByAvatarName(avatarName: string): string {
    return `${AppConstants.AVATAR_URL}/${avatarName}`;
  }

  getAllAvatarsName(): Observable<string[]> {
    return this.http.get<string []>('/avatars');
  }
}
