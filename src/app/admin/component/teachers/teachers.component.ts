import {ModelStatus} from '../../../shared/model/ModelStatus';
import {UserPrinciple} from '../../../shared/model/UserPrinciple';
import {Teacher} from '../../../shared/model/Teacher';
import {UserService} from '../../../shared/service/user.service';
import {TeacherComponent} from './teacher/teacher.component';
import {TeacherService} from '../../../shared/service/teacher.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {AuthService} from '../../../shared/service/auth.service';

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  modelStatus = ModelStatus;
  currentUser: UserPrinciple;
  displayedColumns: string[] = ['actions', 'firstName', 'secondName', 'email', 'education', 'dateBirth', 'status'];
  dataSource: MatTableDataSource<Teacher>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  constructor(private teacherService: TeacherService,
              private userService: UserService,
              private notification: NotificationService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.userPrinciple;
    this.teacherService.findAll().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicateForTeacher();
      }
    );
  }

  customFilterPredicateForTeacher() {
    return (data: Teacher, filter: string): boolean => {
      let rowData = '';
      this.displayedColumns.forEach(column => {
        if (column === 'firstName'
          || column === 'secondName'
          || column === 'education'
          || column === 'email'
          || column === 'dateBirth'
          || column === 'status') {
          rowData = `${rowData + data[column]} `;
        }
      });
      rowData = rowData.trim().toLowerCase();
      let result = true;
      filter.split('+').forEach(key => {
        if (!rowData.includes(key)) {
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

  changeStatus(teacher: Teacher, status: ModelStatus) {
    this.userService.changeStatusById({id: teacher.id, newStatus: status}).subscribe(
      () => {
        teacher.status = status;
        this.notification.showSuccessTranslateMsg('TEACHERS.MESSAGE.STATUS-CHANGED');
      });
  }

  onEdit(teacher: Teacher) {
    const dialogRef = this.dialog.open(TeacherComponent,
      {
        data: teacher
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
    const dialogRef = this.dialog.open(TeacherComponent);
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.dataSource.data.push(res);
          this.dataSource._updateChangeSubscription();
        }
      });
  }
}
