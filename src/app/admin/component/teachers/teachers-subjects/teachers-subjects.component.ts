import {TeachersSubjectService} from '../../../../shared/service/teachers-subject.service';
import {SubjectService} from '../../../../shared/service/subject.service';
import {Teacher} from '../../../../shared/model/Teacher';
import {Subject} from '../../../../shared/model/Subject';
import {ModelStatus} from '../../../../shared/model/ModelStatus';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-teachers-subject',
  templateUrl: './teachers-subjects.component.html',
  styleUrls: ['./teachers-subjects.component.scss']
})
export class TeachersSubjectsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status'];
  dataSource: MatTableDataSource<Subject>;
  @ViewChild(MatSort) sort: MatSort;
  teachersSubjects: Subject[];
  countSubject: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Teacher,
              private teachersSubjectService: TeachersSubjectService,
              private subjectService: SubjectService,
              private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.subjectService.findByStatus(ModelStatus.ACTIVE).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
    });
    this.subjectService.findByTeacherId(this.data.id).subscribe(res => {
      this.teachersSubjects = res;
      this.countSubject = res.length;
    });
  }

  hasSubject(subject: Subject): boolean {
    return this.teachersSubjects?.some(item => item.id === subject.id);
  }

  onChange(e, subject: Subject) {
    if (e.checked) {
      this.teachersSubjectService.create({teacher: this.data, subject}).subscribe(
        () => {
          this.notification.showSuccessTranslateMsg('TEACHERS-SUBJECTS.MESSAGE.GOT-SUBJECT');
          this.countSubject++;
        },
        () => e.source.checked = !e.checked
      );
    } else {
      this.teachersSubjectService.delete(this.data.id, subject.id).subscribe(
        () => {
          this.notification.showSuccessTranslateMsg('TEACHERS-SUBJECTS.MESSAGE.LOST-SUBJECT');
          this.countSubject--;
        },
        () => e.source.checked = !e.checked
      );
    }
  }
}
