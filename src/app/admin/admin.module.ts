import {AdminComponent} from './admin.component';
import {UsersComponent} from './component/users/users.component';
import {UserComponent} from './component/users/user/user.component';
import {AppMaterialModule} from '../app-material/app-material.module';
import {HomeComponent} from './component/home/home.component';
import {ResetPasswordComponent} from './component/users/reset-password/reset-password.component';
import {SubjectsComponent} from './component/subjects/subjects.component';
import {SubjectComponent} from './component/subjects/subject/subject.component';
import {TeachersComponent} from './component/teachers/teachers.component';
import {TeacherComponent} from './component/teachers/teacher/teacher.component';
import {TeachersSubjectsComponent} from './component/teachers/teachers-subjects/teachers-subjects.component';
import {SchoolClassesComponent} from './component/school-classes/school-classes.component';
import {SchoolClassComponent} from './component/school-classes/school-class/school-class.component';
import {PupilsComponent} from './component/pupils/pupils.component';
import {PupilComponent} from './component/pupils/pupil/pupil.component';
import {TemplatesScheduleComponent} from './component/templates-schedule/templates-schedule.component';
import {TemplateScheduleComponent} from './component/templates-schedule/template-schedule/template-schedule.component';
import {GenerateScheduleComponent} from './component/schedule/generate-schedule/generate-schedule.component';
import {ViewScheduleComponent} from './component/schedule/view-schedule/view-schedule.component';
import {EditScheduleComponent} from './component/schedule/edit-schedule/edit-schedule.component';


import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home', data: {breadcrumb: 'MENU-ITEM.HOME'}, component: HomeComponent
      },
      {
        path: 'users', component: UsersComponent, data: {breadcrumb: 'MENU-ITEM.USERS'}
      },
      {
        path: 'teachers', component: TeachersComponent, data: {breadcrumb: 'MENU-ITEM.TEACHERS'}
      },
      {
        path: 'subjects', component: SubjectsComponent, data: {breadcrumb: 'MENU-ITEM.SUBJECTS'}
      },
      {
        path: 'classes', data: {breadcrumb: 'MENU-ITEM.CLASSES'}, children: [
          {
            path: '', component: SchoolClassesComponent, data: {breadcrumb: null}
          },
          {
            path: 'generate-schedule/:classId', component: GenerateScheduleComponent, data: {breadcrumb: 'MENU-ITEM.SCHEDULE-GENERATOR'}
          },
          {
            path: 'view-schedule/:classId', component: ViewScheduleComponent, data: {breadcrumb: 'MENU-ITEM.SCHEDULE-VIEW'}
          }
        ]
      },
      {
        path: 'pupils', component: PupilsComponent, data: {breadcrumb: 'MENU-ITEM.PUPILS'}
      },
      {
        path: 'templates-schedule', component: TemplatesScheduleComponent, data: {breadcrumb: 'MENU-ITEM.TEMPLATE-SCHEDULES'}
      }
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    UserComponent,
    ResetPasswordComponent,
    HomeComponent,
    SubjectsComponent,
    SubjectComponent,
    TeachersComponent,
    TeacherComponent,
    TeachersSubjectsComponent,
    SchoolClassesComponent,
    SchoolClassComponent,
    PupilsComponent,
    PupilComponent,
    TemplatesScheduleComponent,
    TemplateScheduleComponent,
    GenerateScheduleComponent,
    EditScheduleComponent,
    ViewScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FormsModule,
    DragDropModule,
  ]
})
export class AdminModule {
}
