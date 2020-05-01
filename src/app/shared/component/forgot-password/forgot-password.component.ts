import {PasswordService} from '../../service/password.service';
import {NotificationService} from '../../service/notification.service';
import {ResetPasswordWithCheckingComponent} from '../reset-password-with-checking/reset-password-with-checking.component';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private passwordService: PasswordService,
              private notification: NotificationService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<ForgotPasswordComponent>) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        email: this.data,
      });
    }
  }

  onSubmit() {
    this.passwordService.sendResetToken(this.form.value.email).subscribe(
      () => {
        this.notification.showSuccessTranslateMsg('RESET-PASSWORD.MESSAGE.SUCCESSFULLY-SENT');
        this.dialogRef.close(true);
        this.dialog.open(ResetPasswordWithCheckingComponent, {data: this.form.value.email});
      }
    );
  }
}
