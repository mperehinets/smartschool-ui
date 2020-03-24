import {Component, Inject, OnInit} from '@angular/core';
import {AvatarService} from '../../../../shared/service/avatar.service';
import {UserService} from '../../../../shared/service/user.service';
import {User} from '../../../../shared/model/User';
import {NotificationService} from '../../../../shared/service/notification.service';
import {compareValidator} from '../../../../shared/validator/CompareValidator';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-admin',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;
  avatars = new Map<string, string>();
  minDate: Date;
  maxDate: Date;
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
              private avatarService: AvatarService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<UserComponent>,
              private breakpointObserver: BreakpointObserver) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 130, currentDate.getMonth(), currentDate.getDate());
    this.maxDate = new Date(currentDate.getFullYear() - 4, currentDate.getMonth(), currentDate.getDate());

    this.form = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('',
        [
          Validators.pattern('[A-Za-zА-Яа-яіІ\\- ]{3,60}')
        ]),
      secondName: new FormControl('',
        [
          Validators.pattern('[A-Za-zА-Яа-яіІ\\- ]{3,60}')
        ]),
      dateBirth: new FormControl(''),
      avatarName: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
      confirmPassword: new FormControl('', compareValidator('password'))
    });
  }

  ngOnInit(): void {
    this.avatarService.getAllAvatarsName().subscribe(
      res => {
        res.forEach(avatarName => this.avatars.set(avatarName, this.avatarService.getUrlByAvatarName(avatarName)));
      }
    );
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  populateForm(user: User) {
    this.form.patchValue({
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      dateBirth: user.dateBirth,
      avatarName: user.avatarName,
      email: user.email,
      password: 'password',
      confirmPassword: 'password'
    });
  }

  onSubmit() {
    if (!this.data) {
      this.userService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('USER.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.userService.update(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('USER.SUCCESSFULLY-EDITED');
        }
      );
    }
  }
}
