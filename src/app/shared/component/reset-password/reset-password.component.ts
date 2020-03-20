import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../model/User';
import {NotificationService} from '../../service/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  hidePassword = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>) {
  }

  ngOnInit(): void {
    this.userService.resetPasswordForm.patchValue({
      id: this.data.id
    });
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
