import {SchoolClass} from '../../../../shared/model/SchoolClass';
import {SchoolClassService} from '../../../../shared/service/school-class.service';
import {TemplateScheduleService} from '../../../../shared/service/template-schedule.service';
import {TemplateSchedule} from '../../../../shared/model/TemplateSchedule';
import {SubjectService} from '../../../../shared/service/subject.service';
import {Subject} from '../../../../shared/model/Subject';
import {TeacherService} from '../../../../shared/service/teacher.service';
import {NotificationService} from '../../../../shared/service/notification.service';
import {EditScheduleComponent} from '../edit-schedule/edit-schedule.component';
import {TeachersSubjectService} from '../../../../shared/service/teachers-subject.service';
import {ScheduleService} from '../../../../shared/service/schedule.service';
import {ScheduleGeneratorService} from '../../../../shared/service/schedule-generator.service';

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {SatDatepicker} from 'saturn-datepicker';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-generate-schedule',
  templateUrl: './generate-schedule.component.html',
  styleUrls: ['./generate-schedule.component.scss'],
})
export class GenerateScheduleComponent implements OnInit {

  currentSchoolClass: SchoolClass;

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

  constructor(private schoolClassService: SchoolClassService,
              private templateScheduleService: TemplateScheduleService,
              private subjectService: SubjectService,
              private teachersService: TeacherService,
              private notification: NotificationService,
              private router: Router,
              private dialog: MatDialog,
              private scheduleService: ScheduleService,
              private breakpointObserver: BreakpointObserver,
              private teachersSubjectService: TeachersSubjectService,
              private scheduleGeneratorService: ScheduleGeneratorService,
              private route: ActivatedRoute) {
    this.scheduleService.findLastByClassId(+this.route.snapshot.paramMap.get('classId')).subscribe(res => {
      const currentDate = new Date();
      if (res == null || res.date < currentDate) {
        this.minDate = currentDate;
      } else {
        this.minDate = new Date(res.date);
        this.minDate.setDate(this.minDate.getDate() + 1);
      }
      this.minDate.setDate(this.minDate.getDate());
      this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());
    });

    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });

    this.teachersSubjectForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.schoolClassService.findById(+this.route.snapshot.paramMap.get('classId')).subscribe(res => {
      this.currentSchoolClass = res;
      this.templateScheduleService.findByClassNumber(this.currentSchoolClass.number).subscribe(templatesSchedule => {
        this.result = templatesSchedule;
      });
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
      this.initializeResult();
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

  initializeResult() {
    this.result.forEach(template => {
      this.teachersSubjectService.findByTeacherIdAndSubjectId(
        this.teachersSubjectForm.controls[template.teachersSubject.subject.id].value.id, template.teachersSubject.subject.id).subscribe(
        teachersSubject => {
          template.teachersSubject = teachersSubject;
          this.scheduleGeneratorService.canTeacherHoldLesson(template, this.dateRange.beginDate, this.dateRange.endDate).subscribe(
            isValid => template.isValid = isValid
          );
        });
    });
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

  drop(event: CdkDragDrop<TemplateSchedule[]>) {
    const prevIndex = this.currentLessons.data
      .findIndex(item => item.dayOfWeek === event.item.data.dayOfWeek && item.lessonNumber === event.item.data.lessonNumber);
    moveItemInArray(this.currentLessons.data, prevIndex, event.currentIndex);
    this.currentLessons.data.forEach((template, i) => {
      const newLessonNumber = i + 1;
      if (template.lessonNumber !== newLessonNumber && template.teachersSubject) {
        template.lessonNumber = newLessonNumber;
        this.scheduleGeneratorService.canTeacherHoldLesson(template, this.dateRange.beginDate, this.dateRange.endDate).subscribe(
          isValid => template.isValid = isValid
        );
      }
    });
    this.currentLessons._updateChangeSubscription();
  }

  onCancelReorder() {
    this.isDrag = false;
    this.currentLessons.data = this.savedLessons;
  }

  onSubmitReorder() {
    this.isDrag = false;
  }

  onEdit(templateSchedule: TemplateSchedule) {
    const dialogRef = this.dialog.open(EditScheduleComponent,
      {
        data: JSON.parse(JSON.stringify(templateSchedule))
      });
    dialogRef.afterClosed().subscribe(
      template => {
        if (template) {
          this.scheduleGeneratorService.canTeacherHoldLesson(template, this.dateRange.beginDate, this.dateRange.endDate).subscribe(
            isValid => template.isValid = isValid
          );
          if (templateSchedule.teachersSubject) {
            const foundIndex = this.result
              .findIndex(item => item.dayOfWeek === template.dayOfWeek && item.lessonNumber === template.lessonNumber);
            this.result[foundIndex] = template;
          } else {
            this.result.push(template);
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
    this.scheduleGeneratorService.generateSchedule({
      startDate: this.dateRange.beginDate,
      endDate: this.dateRange.endDate,
      schoolClass: this.currentSchoolClass,
      templatesSchedule: this.result
    }).subscribe(() => {
      this.notification.showSuccessTranslateMsg('SCHEDULE.SUCCESSFULLY-GENERATED');
      this.router.navigate(['admin/classes']);
    });
  }
}



