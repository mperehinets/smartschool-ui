import {AvatarService} from '../../../../shared/service/avatar.service';
import {NotificationService} from '../../../../shared/service/notification.service';
import {PupilService} from '../../../../shared/service/pupil.service';
import {compareValidator} from '../../../../shared/validator/CompareValidator';
import {SchoolClass} from '../../../../shared/model/SchoolClass';
import {SchoolClassService} from '../../../../shared/service/school-class.service';
import {Pupil} from '../../../../shared/model/Pupil';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-pupil',
  templateUrl: './pupil.component.html',
  styleUrls: ['./pupil.component.scss']
})
export class PupilComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;
  avatars = new Map<string, string>();
  schoolClasses: SchoolClass[];
  minDate: Date;
  maxDate: Date;
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(@Inject(MAT_DIALOG_DATA) public data: Pupil,
              private pupilService: PupilService,
              private avatarService: AvatarService,
              private schoolClassService: SchoolClassService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<PupilComponent>,
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
      schoolClass: new FormControl(''),
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
    this.schoolClassService.findAll().subscribe(
      res => {
        this.schoolClasses = res.sort((a, b) => a.number - b.number);
      }
    );
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  populateForm(pupil: Pupil) {
    this.form.patchValue({
      id: pupil.id,
      firstName: pupil.firstName,
      secondName: pupil.secondName,
      schoolClass: pupil.schoolClass.id,
      dateBirth: pupil.dateBirth,
      avatarName: pupil.avatarName,
      email: pupil.email,
      password: 'password',
      confirmPassword: 'password'
    });
  }

  onSubmit() {
    this.form.value.schoolClass = this.schoolClasses.find(item => item.id === this.form.value.schoolClass);
    if (!this.data) {
      this.pupilService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('PUPIL.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.pupilService.update(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('PUPIL.SUCCESSFULLY-EDITED');
        }
      );
    }
  }
}
