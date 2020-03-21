import {AvatarService} from '../../service/avatar.service';
import {UserService} from '../../service/user.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss']
})
export class UpdateAvatarComponent implements OnInit {

  avatars = new Map<string, string>();

  constructor(public userService: UserService,
              private avatarService: AvatarService,
              private dialogRef: MatDialogRef<UpdateAvatarComponent>,
              private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.avatarService.getAllAvatarsName().subscribe(
      res => {
        res.forEach(avatarName => this.avatars.set(avatarName, this.avatarService.getUrlByAvatarName(avatarName)));
      }
    );
  }

  onSubmit() {
    this.userService.updateAvatar().subscribe(
      () => {
        this.dialogRef.close(this.userService.updateAvatarForm.value.newAvatarName);
        this.notification.showSuccessTranslateMsg('UPDATE-AVATAR.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }

}
