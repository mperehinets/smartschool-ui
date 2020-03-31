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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: 'home', component: HomeComponent
      },
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'teachers', component: TeachersComponent
      },
      {
        path: 'subjects', component: SubjectsComponent
      }
    ]
  },

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
    TeacherComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FormsModule
  ]
})
export class AdminModule {
}
