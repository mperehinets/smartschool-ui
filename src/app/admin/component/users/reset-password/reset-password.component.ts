import {NotificationService} from '../../../../shared/service/notification.service';
import {compareValidator} from '../../../../shared/validator/CompareValidator';
import {User} from '../../../../shared/model/User';
import {PasswordService} from '../../../../shared/service/password.service';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              public passwordService: PasswordService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>) {
    this.form = new FormGroup({
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', compareValidator('newPassword'))
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.passwordService.resetPassword({
      userEmail: this.data.email,
      resetToken: null,
      newPassword: this.form.value.newPassword
    }).subscribe(
      () => {
        this.dialogRef.close();
        this.form.reset();
        this.notification.showSuccessTranslateMsg('RESET-PASSWORD.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }
}
