import {TemplateScheduleComponent} from './template-schedule/template-schedule.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {TemplateScheduleService} from '../../../shared/service/template-schedule.service';
import {TemplateSchedule} from '../../../shared/model/TemplateSchedule';

import {Component, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-templates-schedule',
  templateUrl: './templates-schedule.component.html',
  styleUrls: ['./templates-schedule.component.scss']
})
export class TemplatesScheduleComponent implements OnInit {
  classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  currentClassNumber = this.classNumbers[0];

  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  currentDayOfWeek = this.daysOfWeek[0];

  isDrag = false;

  displayedColumns: string[] = ['actions', 'lessonNumber', 'subject'];
  dataSource: TemplateSchedule[];
  currentLessons: MatTableDataSource<TemplateSchedule>;

  constructor(private templateScheduleService: TemplateScheduleService,
              private dialog: MatDialog,
              private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.initializeDataSource();
  }

  initializeDataSource() {
    console.log(this.currentClassNumber);
    this.templateScheduleService.findByClassNumber(this.currentClassNumber).subscribe(res => {
      this.dataSource = res;
      this.initializeCurrentLessons();
    });
  }

  initializeCurrentLessons() {
    this.currentLessons = new MatTableDataSource(this.dataSource.filter(item => item.dayOfWeek === this.currentDayOfWeek));
    console.log(this.dataSource.filter(item => item.dayOfWeek === this.currentDayOfWeek));
    for (let i = 1; i <= 10; i++) {
      if (!this.currentLessons.data.find(item => item.lessonNumber === i)) {
        this.currentLessons.data.push({
          id: null,
          classNumber: this.currentClassNumber,
          lessonNumber: i,
          dayOfWeek: this.currentDayOfWeek,
          subject: null
        });
      }
    }
    this.currentLessons.data.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  tabDayChanged(e: MatTabChangeEvent) {
    this.currentDayOfWeek = this.daysOfWeek[e.index];
    this.initializeCurrentLessons();
  }

  tabClassChanged(e: MatTabChangeEvent) {
    this.currentClassNumber = e.index + 1;
    this.currentDayOfWeek = this.daysOfWeek[0];
    this.initializeDataSource();
  }

  onReorder() {
    this.isDrag = true;
    this.currentLessons.data = JSON.parse(JSON.stringify(this.currentLessons.data));
    this.notification.showInfoTranslateMsg('TEMPLATES-SCHEDULE.REORDERING-MODE');
  }

  onCancelReorder() {
    this.isDrag = false;
    this.initializeCurrentLessons();
  }

  onSubmitReorder() {
    this.templateScheduleService.updateAll(this.currentLessons.data.filter(item => item.id !== null)).subscribe(res => {
      this.initializeDataSource();
      this.isDrag = false;
      this.notification.showSuccessTranslateMsg('TEMPLATES-SCHEDULE.SUCCESSFULLY-REORDERED');
    });
  }

  drop(event: CdkDragDrop<TemplateSchedule[]>) {
    const prevIndex = this.currentLessons.data.findIndex(item => item.id === event.item.data.id);
    moveItemInArray(this.currentLessons.data, prevIndex, event.currentIndex);
    this.currentLessons.data.forEach((item, i) => item.lessonNumber = i + 1);
    this.currentLessons._updateChangeSubscription();
  }

  onEdit(templateSchedule: TemplateSchedule) {
    const dialogRef = this.dialog.open(TemplateScheduleComponent,
      {
        data: templateSchedule
      });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          if (templateSchedule.id) {
            const foundIndex = this.dataSource.findIndex(item => item.id === res.id);
            this.dataSource[foundIndex] = res;
          } else {
            this.dataSource.push(res);
          }
          this.initializeCurrentLessons();
        }
      });
  }

  onDelete(templateSchedule: TemplateSchedule) {
    this.templateScheduleService.deleteById(templateSchedule.id).subscribe(() => {
      this.dataSource = this.dataSource.filter(item => item.id !== templateSchedule.id);
      this.initializeCurrentLessons();
      this.notification.showSuccessTranslateMsg('TEMPLATES-SCHEDULE.SUCCESSFULLY-DELETED');
    });
  }
}
