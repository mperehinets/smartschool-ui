import {AdminComponent} from './admin.component';
import {UsersComponent} from './component/users/users.component';
import {UserComponent} from './component/users/user/user.component';
import {AppMaterialModule} from '../app-material/app-material.module';
import {HomeComponent} from './component/home/home.component';

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
      }
    ]
  },

];

@NgModule({
  declarations: [AdminComponent, UsersComponent, UserComponent, HomeComponent],
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
