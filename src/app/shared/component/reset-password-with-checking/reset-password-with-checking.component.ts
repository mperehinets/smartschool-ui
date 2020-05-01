import {ResetPasswordComponent} from '../../../admin/component/users/reset-password/reset-password.component';
import {compareValidator} from '../../validator/CompareValidator';
import {PasswordService} from '../../service/password.service';
import {NotificationService} from '../../service/notification.service';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password-with-checking',
  templateUrl: './reset-password-with-checking.component.html',
  styleUrls: ['./reset-password-with-checking.component.scss']
})
export class ResetPasswordWithCheckingComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              public passwordService: PasswordService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>) {
    this.form = new FormGroup({
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', compareValidator('newPassword')),
      resetToken: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.passwordService.resetPasswordWithChecking({
      userEmail: this.data,
      resetToken: this.form.value.resetToken,
      newPassword: this.form.value.newPassword
    }).subscribe(
      () => {
        this.dialogRef.close();
        this.notification.showSuccessTranslateMsg('RESET-PASSWORD.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }
}
