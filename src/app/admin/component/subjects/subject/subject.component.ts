import {Subject} from '../../../../shared/model/Subject';
import {SubjectService} from '../../../../shared/service/subject.service';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  options: Options = {
    floor: 1,
    ceil: 11,
    step: 1,
    showTicks: true,
  };
  slidersRefresh: EventEmitter<void> = new EventEmitter<void>();
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Subject,
              private subjectService: SubjectService,
              private dialogRef: MatDialogRef<SubjectComponent>,
              private notification: NotificationService) {
    this.form = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('',
        [
          Validators.pattern(/^[A-Za-zА-Яа-яіІїЇєЄ`'\- ]{3,60}$/)
        ]),
      classRange: new FormControl([1, 11])
    });
  }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => this.slidersRefresh.emit());
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  populateForm(subject: Subject) {
    this.form.patchValue({
      id: subject.id,
      name: subject.name,
      classRange: [subject.startClassInterval, subject.endClassInterval]
    });
  }

  onSubmit() {
    const result: Subject = {
      id: this.form.value.id,
      name: this.form.value.name,
      startClassInterval: this.form.value.classRange[0],
      endClassInterval: this.form.value.classRange[1],
      status: null
    };
    if (!this.data) {
      this.subjectService.create(result).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SUBJECT.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.subjectService.update(result).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SUBJECT.SUCCESSFULLY-EDITED');
        }
      );
    }
  }

}
