import {Subject} from '../../../../shared/model/Subject';
import {SubjectService} from '../../../../shared/service/subject.service';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

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
        ])
    });
  }

  isValueChange(): boolean {
    return this.data?.name !== this.form.value.name;
  }

  ngOnInit(): void {
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  populateForm(subject: Subject) {
    this.form.patchValue({
      id: subject.id,
      name: subject.name,
    });
  }

  onSubmit() {
    if (!this.data) {
      this.subjectService.create(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SUBJECT.SUCCESSFULLY-CREATED');
        }
      );
    } else {
      this.subjectService.update(this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
          this.form.reset();
          this.notification.showSuccessTranslateMsg('SUBJECT.SUCCESSFULLY-EDITED');
        }
      );
    }
  }

}
