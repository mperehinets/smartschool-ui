import {AdminGuard} from './guard/admin.guard';
import {TeacherGuard} from './guard/teacher.guard';
import {PupilGuard} from './guard/pupil.guard';
import {RedirectGuard} from './guard/redirect.guard';
import {AuthGuard} from './guard/auth.guard';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard],
    canActivate: [AdminGuard]
  },
  {
    path: 'teacher', loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
    canLoad: [TeacherGuard],
    canActivate: [TeacherGuard]
  },
  {
    path: 'pupil', loadChildren: () => import('./pupil/pupil.module').then(m => m.PupilModule),
    canLoad: [PupilGuard],
    canActivate: [PupilGuard]
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard]
  },
  {path: '', children: [], canActivate: [RedirectGuard]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
