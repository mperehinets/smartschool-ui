import {Subject} from '../../../shared/model/Subject';
import {SubjectComponent} from './subject/subject.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {SubjectService} from '../../../shared/service/subject.service';
import {ModelStatus} from '../../../shared/model/ModelStatus';

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  modelStatus = ModelStatus;
  displayedColumns: string[] = ['actions', 'name', 'status'];
  dataSource: MatTableDataSource<Subject>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  constructor(private subjectService: SubjectService,
              private notification: NotificationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subjectService.findAll().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.customFilterPredicateForSubjects();
    });
  }

  customFilterPredicateForSubjects() {
    return (data: Subject, filter: string): boolean => {
      let rowDate = '';
      this.displayedColumns.forEach(column => {
        if (column === 'name' || column === 'status') {
          rowDate = `${rowDate + data[column]} `;
        }
      });
      rowDate = rowDate.trim().toLowerCase();
      let result = true;
      filter.split('+').forEach(key => {
        if (!rowDate.includes(key)) {
          result = false;
          return;
        }
      });
      return result;
    };
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  changeStatus(subject: Subject, status: ModelStatus) {
    this.subjectService.changeStatusById({id: subject.id, newStatus: status}).subscribe(
      () => {
        subject.status = status;
        this.notification.showSuccessTranslateMsg('SUBJECTS.MESSAGE.STATUS-CHANGED');
      });
  }

  onEdit(subject: Subject) {
    const dialogRef = this.dialog.open(SubjectComponent,
      {
        data: subject
      });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          const foundIndex = this.dataSource.data.findIndex(item => item.id === res.id);
          this.dataSource.data[foundIndex] = res;
          this.dataSource._updateChangeSubscription();
        }
      });

  }

  onCreate() {
    const dialogRef = this.dialog.open(SubjectComponent);
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.dataSource.data.push(res);
          this.dataSource._updateChangeSubscription();
        }
      });
  }
}
