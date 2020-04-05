import {UserService} from '../../../shared/service/user.service';
import {SubjectService} from '../../../shared/service/subject.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {SchoolClassService} from '../../../shared/service/school-class.service';
import {PupilService} from '../../../shared/service/pupil.service';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menuItems = [
    {name: 'MENU-ITEM.USERS', rout: '/admin/users', icon: 'users.png', count: 0},
    {name: 'MENU-ITEM.PUPILS', rout: '/admin/pupils', icon: 'pupils.png', count: 0},
    {name: 'MENU-ITEM.TEACHERS', rout: '/admin/teachers', icon: 'teachers.png', count: 0},
    {name: 'MENU-ITEM.CLASSES', rout: '/admin/classes', icon: 'classes.png', count: 0},
    {name: 'MENU-ITEM.SUBJECTS', rout: '/admin/subjects', icon: 'subjects.png', count: 0}
  ];

  constructor(private userService: UserService,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private schoolClassesService: SchoolClassService,
              private pupilService: PupilService) {
  }

  ngOnInit(): void {
    this.userService.getCount().subscribe(res => this.menuItems[0].count = res);
    this.pupilService.getCount().subscribe(res => this.menuItems[1].count = res);
    this.teacherService.getCount().subscribe(res => this.menuItems[2].count = res);
    this.schoolClassesService.getCount().subscribe(res => this.menuItems[3].count = res);
    this.subjectService.getCount().subscribe(res => this.menuItems[4].count = res);
  }
}
