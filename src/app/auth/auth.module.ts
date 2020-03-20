import {AuthComponent} from './auth.component';
import {LoginComponent} from './component/login/login.component';
import {AppMaterialModule} from '../app-material/app-material.module';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      {
        path: 'login', component: LoginComponent
      }
    ]
  }
];

@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    AppMaterialModule
  ]
})
export class AuthModule {
}
