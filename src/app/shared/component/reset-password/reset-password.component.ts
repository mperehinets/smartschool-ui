import {UserService} from '../../service/user.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  hidePassword = true;

  constructor(public userService: UserService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.resetPasswordByAdmin().subscribe(
      () => {
        this.dialogRef.close();
        this.notification.showSuccessTranslateMsg('RESET-PASSWORD.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }

}
