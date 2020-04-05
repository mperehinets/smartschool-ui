import {Pupil} from '../../../shared/model/Pupil';
import {customFilter} from '../../../shared/filter-predicat';
import {Teacher} from '../../../shared/model/Teacher';
import {PupilComponent} from './pupil/pupil.component';
import {PupilService} from '../../../shared/service/pupil.service';
import {ModelStatus} from '../../../shared/model/ModelStatus';
import {UserPrinciple} from '../../../shared/model/UserPrinciple';
import {UserService} from '../../../shared/service/user.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {AuthService} from '../../../shared/service/auth.service';

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-pupils',
  templateUrl: './pupils.component.html',
  styleUrls: ['./pupils.component.scss']
})
export class PupilsComponent implements OnInit {

  modelStatus = ModelStatus;
  currentUser: UserPrinciple;
  displayedColumns: string[] = ['actions', 'firstName', 'secondName', 'email', 'schoolClass', 'dateBirth', 'status'];
  dataSource: MatTableDataSource<Pupil>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  constructor(private pupilService: PupilService,
              private userService: UserService,
              private notification: NotificationService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.userPrinciple;
    this.pupilService.findAll().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = customFilter(this.displayedColumns);
      }
    );
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
        this.notification.showSuccessTranslateMsg('PUPILS.MESSAGE.STATUS-CHANGED');
      });
  }

  onEdit(pupil: Pupil) {
    pupil.schoolClass.classTeacher = null;
    const dialogRef = this.dialog.open(PupilComponent,
      {
        data: pupil
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
    const dialogRef = this.dialog.open(PupilComponent);
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.dataSource.data.push(res);
          this.dataSource._updateChangeSubscription();
        }
      });
  }
}
