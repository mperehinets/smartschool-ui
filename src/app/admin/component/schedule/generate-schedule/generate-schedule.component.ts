import {SchoolClass} from '../../../../shared/model/SchoolClass';
import {SchoolClassService} from '../../../../shared/service/school-class.service';
import {TemplateScheduleService} from '../../../../shared/service/template-schedule.service';
import {TemplateSchedule} from '../../../../shared/model/TemplateSchedule';
import {SubjectService} from '../../../../shared/service/subject.service';
import {Subject} from '../../../../shared/model/Subject';
import {TeacherService} from '../../../../shared/service/teacher.service';
import {NotificationService} from '../../../../shared/service/notification.service';
import {EditScheduleComponent} from './edit-schedule/edit-schedule.component';
import {TeachersSubjectService} from '../../../../shared/service/teachers-subject.service';
import {ScheduleService} from '../../../../shared/service/schedule.service';

import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SatDatepicker} from 'saturn-datepicker';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-generate-schedule',
  templateUrl: './generate-schedule.component.html',
  styleUrls: ['./generate-schedule.component.scss'],
})
export class GenerateScheduleComponent implements OnInit {

  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  dateRangeForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  @ViewChild('picker') dateRange: SatDatepicker<any>;

  teachersSubjectForm: FormGroup;
  subjects: Subject[] = [];

  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  currentDayOfWeek = this.daysOfWeek[0];
  displayedColumns: string[] = ['actions', 'lessonNumber', 'subject', 'teacher'];
  currentLessons: MatTableDataSource<TemplateSchedule>;
  savedLessons: TemplateSchedule[];
  isDrag = false;

  result: TemplateSchedule[];

  constructor(@Inject(MAT_DIALOG_DATA) public currentSchoolClass: SchoolClass,
              private schoolClassService: SchoolClassService,
              private templateScheduleService: TemplateScheduleService,
              private subjectService: SubjectService,
              private teachersService: TeacherService,
              private notification: NotificationService,
              private dialog: MatDialog,
              private scheduleService: ScheduleService,
              private breakpointObserver: BreakpointObserver,
              private teachersSubjectService: TeachersSubjectService,
              private dialogRef: MatDialogRef<GenerateScheduleComponent>) {
    this.scheduleService.findMinGenerationDateByClassId(this.currentSchoolClass.id).subscribe(res => {
      this.minDate = new Date(res);
      this.minDate.setDate(this.minDate.getDate());
      this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());
    });

    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });

    this.teachersSubjectForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.templateScheduleService.findByClassNumber(this.currentSchoolClass.number).subscribe(templatesSchedule => {
      this.result = templatesSchedule;
    });
  }

  dateFilter(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  onSelectStep(e) {
    if (e.selectedIndex === 1) {
      this.initializeTeachersSubjectForm();
    } else if (e.selectedIndex === 2) {
      this.result.forEach(schedule => {
        this.teachersSubjectService.findByTeacherIdAndSubjectId(
          this.teachersSubjectForm.controls[schedule.teachersSubject.subject.id].value.id,
          schedule.teachersSubject.subject.id).subscribe(res => {
          schedule.teachersSubject = res;
        });
      });
      this.initializeCurrentLessons();
    }
  }

  initializeTeachersSubjectForm() {
    for (const subject of this.result.map(item => item.teachersSubject.subject)) {
      if (!this.subjects.find(item => item.id === subject.id)) {
        this.teachersService.findBySubjectId(subject.id).subscribe(res => {
          subject.teachers = res;
        });
        this.subjects.push(subject);
        this.teachersSubjectForm.addControl(`${subject.id}`, new FormControl(''));
      }
    }
  }

  initializeCurrentLessons() {
    this.currentLessons = new MatTableDataSource(this.result.filter(item => item.dayOfWeek === this.currentDayOfWeek));
    for (let i = 1; i <= 10; i++) {
      if (!this.currentLessons.data.find(item => item.lessonNumber === i)) {
        this.currentLessons.data.push({
          id: null,
          classNumber: this.currentSchoolClass.number,
          lessonNumber: i,
          dayOfWeek: this.currentDayOfWeek,
          teachersSubject: null
        });
      }
    }
    this.currentLessons.data.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  tabDayChanged(e: MatTabChangeEvent) {
    this.currentDayOfWeek = this.daysOfWeek[e.index];
    this.initializeCurrentLessons();
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
    this.isDrag = false;
  }

  drop(event: CdkDragDrop<TemplateSchedule[]>) {
    const prevIndex = this.currentLessons.data
      .findIndex(item => item.dayOfWeek === event.item.data.dayOfWeek && item.lessonNumber === event.item.data.lessonNumber);
    moveItemInArray(this.currentLessons.data, prevIndex, event.currentIndex);
    this.currentLessons.data.forEach((item, i) => {
      item.lessonNumber = i + 1;
      item.isValid = true;
    });
    this.currentLessons._updateChangeSubscription();
  }

  onEdit(templateSchedule: TemplateSchedule) {
    const dialogRef = this.dialog.open(EditScheduleComponent,
      {
        data: JSON.parse(JSON.stringify(templateSchedule))
      });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          res.isValid = true;
          if (templateSchedule.teachersSubject) {
            const foundIndex = this.result
              .findIndex(item => item.dayOfWeek === res.dayOfWeek && item.lessonNumber === res.lessonNumber);
            this.result[foundIndex] = res;
          } else {
            this.result.push(res);
          }
          this.initializeCurrentLessons();
        }
      });
  }

  onDelete(templateSchedule: TemplateSchedule) {
    this.result = this.result
      .filter(item => !(item.dayOfWeek === templateSchedule.dayOfWeek && item.lessonNumber === templateSchedule.lessonNumber));
    this.initializeCurrentLessons();
  }

  onGenerate() {
    this.scheduleService.generateSchedule({
      startDate: new Date(moment(this.dateRange.beginDate).format('YYYY-MM-DD')),
      endDate: new Date(moment(this.dateRange.endDate).format('YYYY-MM-DD')),
      schoolClass: this.currentSchoolClass,
      templatesSchedule: this.result
    }).subscribe(
      () => {
        this.notification.showSuccessTranslateMsg('SCHEDULE.SUCCESSFULLY-GENERATED');
        this.dialogRef.close();
      },
      error => {
        this.result.forEach(template => {
          if ((error.error.payload as Array<TemplateSchedule>)
            .find(invalidTemplate => invalidTemplate.dayOfWeek === template.dayOfWeek
              && invalidTemplate.lessonNumber === template.lessonNumber)) {
            template.isValid = false;
          }
        });
      });
  }
}



