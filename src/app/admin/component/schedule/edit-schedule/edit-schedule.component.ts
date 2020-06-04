import {TeachersSubjectService} from '../../../../shared/service/teachers-subject.service';
import {Subject} from '../../../../shared/model/Subject';
import {Teacher} from '../../../../shared/model/Teacher';
import {TemplateSchedule} from '../../../../shared/model/TemplateSchedule';
import {SubjectService} from '../../../../shared/service/subject.service';
import {BaseModel} from '../../../../shared/model/BaseModel';
import {TeacherService} from '../../../../shared/service/teacher.service';
import {isSchedule, Schedule} from '../../../../shared/model/Schedule';
import {ScheduleService} from '../../../../shared/service/schedule.service';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {

  form: FormGroup;
  subjects: Subject[];
  teachers: Teacher[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: TemplateSchedule | Schedule,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private scheduleService: ScheduleService,
              private notification: NotificationService,
              private teachersSubjectService: TeachersSubjectService,
              private dialogRef: MatDialogRef<EditScheduleComponent>) {
    this.form = new FormGroup({
      subject: new FormControl(''),
      teacher: new FormControl({value: '', disabled: this.data.teachersSubject === null}),
    });
  }

  ngOnInit(): void {
    let classNumber: number;
    if (isSchedule(this.data)) {
      classNumber = (this.data as Schedule).schoolClass.number;
    } else {
      classNumber = (this.data as TemplateSchedule).classNumber;
    }
    this.subjectService.findByClassNumber(classNumber).subscribe(subjects => {
      this.subjects = subjects;
      if (this.data.teachersSubject !== null) {
        this.teacherService.findBySubjectId(this.data.teachersSubject.subject.id).subscribe(teachers => {
          this.teachers = teachers;
          this.populateForm();
        });
      }
    });
  }

  populateForm() {
    this.form.patchValue({
      subject: this.data.teachersSubject.subject,
      teacher: this.data.teachersSubject.teacher,
    });
  }

  compareById(a: BaseModel, b: BaseModel): boolean {
    return a?.id === b?.id;
  }

  onChangeSubject() {
    this.teacherService.findBySubjectId(this.form.value.subject.id).subscribe(teachers => {
      this.teachers = teachers;
      this.form.controls.teacher.enable();
    });
  }

  onSubmit() {
    if (this.data.teachersSubject?.teacher.id !== this.form.value.teacher.id
      || this.data.teachersSubject?.subject.id !== this.form.value.subject.id) {
      this.teachersSubjectService.findByTeacherIdAndSubjectId(this.form.value.teacher.id, this.form.value.subject.id).subscribe(res => {
        this.data.teachersSubject = res;
        if (isSchedule(this.data)) {
          if (this.data.id === null) {
            this.scheduleService.create(this.data as Schedule).subscribe(schedule => {
              this.dialogRef.close(schedule);
              this.notification.showSuccessTranslateMsg('SCHEDULE.SUCCESSFULLY-CREATED');
            });
          } else {
            this.scheduleService.update(this.data as Schedule).subscribe(schedule => {
              this.dialogRef.close(schedule);
              this.notification.showSuccessTranslateMsg('SCHEDULE.SUCCESSFULLY-EDITED');
            });
          }
        } else {
          this.dialogRef.close(this.data);
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
