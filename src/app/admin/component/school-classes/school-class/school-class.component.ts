import {TeacherService} from '../../../../shared/service/teacher.service';
import {SchoolClassService} from '../../../../shared/service/school-class.service';
import {SchoolClass} from '../../../../shared/model/SchoolClass';
import {NotificationService} from '../../../../shared/service/notification.service';
import {Teacher} from '../../../../shared/model/Teacher';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  isEditProcess: boolean;
  form: FormGroup;
  freeTeachers: Teacher[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: SchoolClass | number,
              private teacherService: TeacherService,
              private schoolClassService: SchoolClassService,
              private notification: NotificationService,
              private dialogRef: MatDialogRef<SchoolClassComponent>) {
    this.form = new FormGroup({
      id: new FormControl(''),
      number: new FormControl(''),
      classTeacher: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.isEditProcess = typeof (this.data) !== 'number';
    this.teacherService.findFree().subscribe(res => {
      this.freeTeachers = res;
      if (this.isEditProcess) {
        this.freeTeachers.push((this.data as SchoolClass).classTeacher);
      }
    });
    this.populateForm();
  }

  populateForm() {
    if (this.isEditProcess) {
      const schoolClass = this.data as SchoolClass;
      this.form.patchValue({
        id: schoolClass.id,
        number: schoolClass.number,
        classTeacher: schoolClass.classTeacher
      });
    } else {
      this.form.patchValue({
        number: this.data,
      });
    }
  }

  onSubmit() {
    if (!this.isEditProcess) {
      this.schoolClassService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SCHOOL-CLASS.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.schoolClassService.update(this.form.value).subscribe(
        res => {
          res.pupilsCount = (this.data as SchoolClass).pupilsCount;
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SCHOOL-CLASS.SUCCESSFULLY-EDITED');
        }
      );
    }
  }
}
