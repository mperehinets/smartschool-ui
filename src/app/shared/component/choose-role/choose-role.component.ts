import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-choose-role',
  templateUrl: './choose-role.component.html',
  styleUrls: ['./choose-role.component.scss']
})
export class ChooseRoleComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private router: Router) {
  }

  setCurrentRole(role: string) {
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['admin/home']);
    } else if (role === 'ROLE_TEACHER') {
      this.router.navigate(['teacher']);
    } else if (role === 'ROLE_PUPIL') {
      this.router.navigate(['pupil']);
    }
  }
}
