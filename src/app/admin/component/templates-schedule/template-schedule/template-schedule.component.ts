import {Subject} from '../../../../shared/model/Subject';
import {SubjectService} from '../../../../shared/service/subject.service';
import {ModelStatus} from '../../../../shared/model/ModelStatus';
import {NotificationService} from '../../../../shared/service/notification.service';
import {TemplateSchedule} from '../../../../shared/model/TemplateSchedule';
import {TemplateScheduleService} from '../../../../shared/service/template-schedule.service';

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-template-schedule',
  templateUrl: './template-schedule.component.html',
  styleUrls: ['./template-schedule.component.scss']
})
export class TemplateScheduleComponent implements OnInit {

  form: FormGroup;
  subjects: Subject[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: TemplateSchedule,
              private templateScheduleService: TemplateScheduleService,
              private subjectService: SubjectService,
              private dialogRef: MatDialogRef<TemplateScheduleComponent>,
              private notification: NotificationService) {
    this.form = new FormGroup({
      id: new FormControl(''),
      classNumber: new FormControl(''),
      lessonNumber: new FormControl(''),
      dayOfWeek: new FormControl(''),
      subject: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.subjectService.findByStatus(ModelStatus.ACTIVE).subscribe(res => {
      this.subjects = res;
      this.populateForm();
    });
  }

  populateForm() {
    this.form.patchValue({
      id: this.data.id,
      classNumber: this.data.classNumber,
      lessonNumber: this.data.lessonNumber,
      dayOfWeek: this.data.dayOfWeek,
      subject: this.data.subject
    });
  }

  compareById(a: Subject, b: Subject): boolean {
    return a?.id === b?.id;
  }

  onSubmit() {
    if (!this.data.id) {
      this.templateScheduleService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('TEMPLATE-SCHEDULE.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.templateScheduleService.update(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('TEMPLATE-SCHEDULE.SUCCESSFULLY-EDITED');
        }
      );
    }
  }
}