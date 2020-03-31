import {AvatarService} from '../../../../shared/service/avatar.service';
import {NotificationService} from '../../../../shared/service/notification.service';
import {TeacherService} from '../../../../shared/service/teacher.service';
import {compareValidator} from '../../../../shared/validator/CompareValidator';
import {Teacher} from '../../../../shared/model/Teacher';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Teacher,
              private teacherService: TeacherService,
              private avatarService: AvatarService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<TeacherComponent>,
              private breakpointObserver: BreakpointObserver) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 130, currentDate.getMonth(), currentDate.getDate());
    this.maxDate = new Date(currentDate.getFullYear() - 4, currentDate.getMonth(), currentDate.getDate());

    this.form = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('',
        [
          Validators.pattern(/^[A-Za-zА-Яа-яіІїЇєЄ`'\- ]{3,60}$/)
        ]),
      secondName: new FormControl('',
        [
          Validators.pattern(/^[A-Za-zА-Яа-яіІїЇєЄ`'\- ]{3,60}$/)
        ]),
      education: new FormControl('',
        [
          Validators.pattern(/^[A-Za-zА-Яа-яіІїЇєЄ`'\- ]{0,200}$/)
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

  populateForm(teacher: Teacher) {
    this.form.patchValue({
      id: teacher.id,
      firstName: teacher.firstName,
      secondName: teacher.secondName,
      education: teacher.education,
      dateBirth: teacher.dateBirth,
      avatarName: teacher.avatarName,
      email: teacher.email,
      password: 'password',
      confirmPassword: 'password'
    });
  }

  onSubmit() {
    if (!this.data) {
      this.teacherService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('TEACHER.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.teacherService.update(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('TEACHER.SUCCESSFULLY-EDITED');
        }
      );
    }
  }
}
