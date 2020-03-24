import {AvatarService} from '../../service/avatar.service';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';
import {User} from '../../model/User';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss']
})
export class UpdateAvatarComponent implements OnInit {

  form: FormGroup;
  avatars = new Map<string, string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
              private avatarService: AvatarService,
              private dialogRef: MatDialogRef<UpdateAvatarComponent>,
              private notification: NotificationService) {
    this.form = new FormGroup({
      id: new FormControl(''),
      newAvatarName: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.avatarService.getAllAvatarsName().subscribe(
      res => {
        res.forEach(avatarName => this.avatars.set(avatarName, this.avatarService.getUrlByAvatarName(avatarName)));
      }
    );
    this.populateForm(this.data);
  }

  populateForm(user: User) {
    this.form.patchValue({
      id: user.id,
      newAvatarName: user.avatarName
    });
  }

  onSubmit() {
    this.userService.updateAvatar(this.form.value).subscribe(
      () => {
        this.dialogRef.close(this.form.value.newAvatarName);
        this.notification.showSuccessTranslateMsg('UPDATE-AVATAR.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }

}
