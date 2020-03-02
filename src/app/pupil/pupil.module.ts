import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {PupilComponent} from './pupil.component';

const routes: Routes = [
  {path: '', component: PupilComponent}
];

@NgModule({
  declarations: [PupilComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PupilModule {
}
