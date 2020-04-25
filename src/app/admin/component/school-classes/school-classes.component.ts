import {SchoolClassComponent} from './school-class/school-class.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {SchoolClassService} from '../../../shared/service/school-class.service';
import {SchoolClass} from '../../../shared/model/SchoolClass';
import {AvatarService} from '../../../shared/service/avatar.service';

import {Component, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-school-classes',
  templateUrl: './school-classes.component.html',
  styleUrls: ['./school-classes.component.scss']
})
export class SchoolClassesComponent implements OnInit {

  classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  currentClassNumber = 1;
  classes: SchoolClass[];

  constructor(public avatarService: AvatarService,
              private schoolClassService: SchoolClassService,
              private dialog: MatDialog,
              private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.schoolClassService.findAll().subscribe(res => {
      this.classes = res;
    });
  }

  findByClassNumber(classNumber: number): SchoolClass[] {
    return this.classes?.filter(item => item.number === classNumber);
  }

  tabChanged(e: MatTabChangeEvent) {
    this.currentClassNumber = e.index + 1;
  }

  countByClassNumber(classNumber: number): number {
    return this.classes?.filter(item => item.number === classNumber).length;
  }

  onCreate() {
    const dialogRef = this.dialog.open(SchoolClassComponent, {
      data: this.currentClassNumber
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          res.pupilsCount = 0;
          this.classes.push(res);
        }
      });
  }

  onEdit(schoolClass: SchoolClass) {
    const dialogRef = this.dialog.open(SchoolClassComponent, {
      data: schoolClass
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          res.pupilsCount = schoolClass.pupilsCount;
          const foundIndex = this.classes.findIndex(item => item.id === res.id);
          this.classes[foundIndex] = res;
        }
      });
  }

  onDelete(schoolClass: SchoolClass) {
    this.schoolClassService.deleteById(schoolClass.id).subscribe(() => {
      this.classes = this.classes.filter(item => item.id !== schoolClass.id);
      this.notification.showSuccessTranslateMsg('SCHOOL-CLASSES.SUCCESSFULLY-DELETED');
    });
  }
}
