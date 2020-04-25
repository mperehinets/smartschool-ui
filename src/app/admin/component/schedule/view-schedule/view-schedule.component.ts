import {EditScheduleComponent} from '../edit-schedule/edit-schedule.component';
import {SchoolClass} from '../../../../shared/model/SchoolClass';
import {ScheduleService} from '../../../../shared/service/schedule.service';
import {Schedule} from '../../../../shared/model/Schedule';
import {SchoolClassService} from '../../../../shared/service/school-class.service';
import {NotificationService} from '../../../../shared/service/notification.service';

import {Component, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from 'saturn-datepicker';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import {Moment} from 'moment';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM YYYY ddd',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ViewScheduleComponent implements OnInit {

  currentSchoolClass: SchoolClass;
  currentDate: Moment;

  isDrag = false;

  displayedColumns: string[] = ['actions', 'lessonNumber', 'subject', 'teacher'];
  currentLessons: MatTableDataSource<Schedule>;
  savedLessons: Schedule[];

  constructor(private scheduleService: ScheduleService,
              private schoolClassService: SchoolClassService,
              private notification: NotificationService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    this.currentDate = moment(new Date());
  }

  get isCurrentDayInThePast(): boolean {
    return this.currentDate.format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.schoolClassService.findById(+this.route.snapshot.paramMap.get('classId')).subscribe(res => {
      this.currentSchoolClass = res;
      this.loadSchedule();
    });
  }

  loadSchedule() {
    this.scheduleService.findByClassIdAndDate(this.currentSchoolClass.id, this.currentDate.toDate()).subscribe(res => {
      this.currentLessons = new MatTableDataSource(res);
      if (!this.isCurrentDayInThePast) {
        for (let i = 1; i <= 10; i++) {
          if (!this.currentLessons.data.find(item => item.lessonNumber === i)) {
            this.currentLessons.data.push({
              id: null,
              schoolClass: this.currentSchoolClass,
              lessonNumber: i,
              date: this.currentDate.toDate(),
              teachersSubject: null
            });
          }
        }
      }
      this.currentLessons.data.sort((a, b) => a.lessonNumber - b.lessonNumber);
    });
  }

  onNextDate() {
    const newDate = this.currentDate.clone();
    newDate.add(1, 'days');
    this.currentDate = newDate;
    this.loadSchedule();
  }

  onPreviousDate() {
    const newDate = this.currentDate.clone();
    newDate.subtract(1, 'days');
    this.currentDate = newDate;
    this.loadSchedule();
  }

  onReorder() {
    this.isDrag = true;
    this.savedLessons = JSON.parse(JSON.stringify(this.currentLessons.data));
    this.notification.showInfoTranslateMsg('TEMPLATES-SCHEDULE.REORDERING-MODE');
  }

  onCancelReorder() {
    this.isDrag = false;
    this.currentLessons.data = this.savedLessons;
  }

  onSubmitReorder() {
    this.scheduleService.updateAll(this.currentLessons.data.filter(item => item.id !== null)).subscribe(() => {
      this.isDrag = false;
      this.notification.showSuccessTranslateMsg('SCHEDULE.SUCCESSFULLY-REORDERED');
    });
  }

  drop(event: CdkDragDrop<Schedule[]>) {
    const prevIndex = this.currentLessons.data.findIndex(item => item.id === event.item.data.id);
    moveItemInArray(this.currentLessons.data, prevIndex, event.currentIndex);
    this.currentLessons.data.forEach((lesson, i) => {
      const newLessonNumber = i + 1;
      if (lesson.lessonNumber !== newLessonNumber) {
        lesson.lessonNumber = newLessonNumber;
        if (lesson.id && !this.savedLessons.find(item => item?.id === lesson.id && item.lessonNumber === lesson.lessonNumber)) {
          this.scheduleService.canTeacherHoldLesson(lesson.teachersSubject.teacher.id, lesson.date, lesson.lessonNumber).subscribe(
            isValid => lesson.isValid = isValid);
        } else {
          lesson.isValid = true;
        }
      }
    });
    this.currentLessons._updateChangeSubscription();
  }

  onEdit(schedule: Schedule) {
    const dialogRef = this.dialog.open(EditScheduleComponent,
      {
        data: JSON.parse(JSON.stringify(schedule))
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const foundIndex = this.currentLessons.data.findIndex(item => item.id === schedule.id);
        this.currentLessons.data[foundIndex] = res;
        this.currentLessons._updateChangeSubscription();
      }
    });
  }

  onDelete(schedule: Schedule) {
    this.scheduleService.deleteById(schedule.id).subscribe(() => {
      const foundIndex = this.currentLessons.data.findIndex(item => item.id === schedule.id);
      this.currentLessons.data[foundIndex] = {
        id: null,
        schoolClass: this.currentSchoolClass,
        lessonNumber: schedule.lessonNumber,
        date: this.currentDate.toDate(),
        teachersSubject: null
      };
      this.currentLessons._updateChangeSubscription();
      this.notification.showSuccessTranslateMsg('TEMPLATES-SCHEDULE.SUCCESSFULLY-DELETED');
    });
  }
}
