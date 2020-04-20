import {TeachersSubjectService} from '../../../../../shared/service/teachers-subject.service';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject} from '../../../../../shared/model/Subject';
import {Teacher} from '../../../../../shared/model/Teacher';
import {TemplateSchedule} from '../../../../../shared/model/TemplateSchedule';
import {SubjectService} from '../../../../../shared/service/subject.service';
import {BaseModel} from '../../../../../shared/model/BaseModel';
import {TeacherService} from '../../../../../shared/service/teacher.service';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {

  form: FormGroup;
  subjects: Subject[];
  teachers: Teacher[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: TemplateSchedule,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private teachersSubjectService: TeachersSubjectService,
              private dialogRef: MatDialogRef<EditScheduleComponent>) {
    this.form = new FormGroup({
      subject: new FormControl(''),
      teacher: new FormControl({value: '', disabled: this.data.teachersSubject === null}),
    });
  }

  ngOnInit(): void {
    this.subjectService.findAll().subscribe(subjects => {
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
    this.teachersSubjectService.findByTeacherIdAndSubjectId(this.form.value.teacher.id, this.form.value.subject.id).subscribe(res => {
      this.data.teachersSubject = res;
      this.dialogRef.close(this.data);
    });
  }
}
