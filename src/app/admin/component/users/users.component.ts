import {User} from '../../../shared/model/User';
import {UserService} from '../../../shared/service/user.service';
import {ModelStatus} from '../../../shared/model/ModelStatus';
import {UserComponent} from './user/user.component';
import {UserPrinciple} from '../../../shared/model/UserPrinciple';
import {AuthService} from '../../../shared/service/auth.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {ResetPasswordComponent} from '../../../shared/component/reset-password/reset-password.component';

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  modelStatus = ModelStatus;
  currentUser: UserPrinciple;
  displayedColumns: string[] = ['actions', 'firstName', 'secondName', 'email', 'dateBirth', 'status', 'pupil', 'teacher', 'admin'];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  constructor(private userService: UserService,
              private notification: NotificationService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.userPrinciple;
    this.userService.findAll().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
      }
    );
  }

  customFilterPredicate() {
    return (data: User, filter: string): boolean => {
      let userStr = '';
      this.displayedColumns.forEach(column => {
        if (column === 'firstName'
          || column === 'secondName'
          || column === 'email'
          || column === 'dateBirth'
          || column === 'status') {
          userStr = `${userStr + data[column]} `;
        }
      });
      let roleStr = '';
      data.roles.forEach(role => roleStr = `${roleStr + role.name.substr(5)} `);
      const rowDate = (userStr + roleStr).trim().toLowerCase();
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

  hasRole(user: User, roleName: string): boolean {
    return user.roles.some(item => item.name === roleName);
  }

  changeStatus(user: User, status: ModelStatus) {
    this.userService.changeStatusById(user.id, status).subscribe(
      () => {
        user.status = status;
        this.notification.showSuccessTranslateMsg('USERS.MESSAGE.STATUS-CHANGED');
      });
  }

  onChangeAdmin(e, user: User) {
    if (e.checked) {
      this.userService.giveAdminById(user.id).subscribe(
        () => this.notification.showSuccessTranslateMsg('USERS.MESSAGE.GOT-ADMIN'),
        () => e.source.checked = !e.checked
      );
    } else {
      this.userService.takeAdminAwayById(user.id).subscribe(
        () => this.notification.showSuccessTranslateMsg('USERS.MESSAGE.LOST-ADMIN'),
        () => e.source.checked = !e.checked
      );
    }
  }

  onEdit(user: User) {
    this.userService.populateUserForm(user);
    const dialogRef = this.dialog.open(UserComponent,
      {
        data: user
      });
    dialogRef.afterClosed().subscribe(
      res => {
        this.userService.userForm.reset();
        if (res) {
          const foundIndex = this.dataSource.data.findIndex(item => item.id === res.id);
          this.dataSource.data[foundIndex] = res;
          this.dataSource._updateChangeSubscription();
        }
      });
  }

  onCreate() {
    const dialogRef = this.dialog.open(UserComponent);
    dialogRef.afterClosed().subscribe(
      res => {
        this.userService.userForm.reset();
        if (res) {
          this.dataSource.data.push(res);
          this.dataSource._updateChangeSubscription();
        }
      });
  }

  onResetPassword(user: User) {
    this.userService.populateResetPasswordForm(user);
    const dialogRef = this.dialog.open(ResetPasswordComponent);
    dialogRef.afterClosed().subscribe(() => this.userService.resetPasswordForm.reset());
  }
}
