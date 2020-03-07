import {AppConstants} from '../app-constants';

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor() {
  }

  getUrlByAvatarName(avatarName: string): string {
    return `${AppConstants.AVATAR_URL}/${avatarName}`;
  }
}
