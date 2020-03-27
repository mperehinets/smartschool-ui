import {UserService} from '../../../../shared/service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {compareValidator} from '../../../../shared/validator/CompareValidator';
import {User} from '../../../../shared/model/User';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>) {
    this.form = new FormGroup({
      id: new FormControl(''),
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', compareValidator('newPassword'))
    });
  }

  ngOnInit(): void {
    this.populateForm(this.data);
  }

  populateForm(user: User) {
    this.form.patchValue({
      id: user.id
    });
  }

  onSubmit() {
    this.userService.resetPassword(this.form.value).subscribe(
      () => {
        this.dialogRef.close();
        this.form.reset();
        this.notification.showSuccessTranslateMsg('RESET-PASSWORD.MESSAGE.SUCCESSFULLY-CHANGED');
      }
    );
  }

}
