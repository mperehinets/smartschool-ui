import {UserService} from '../../service/user.service';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menuItems = [
    {name: 'MENU-ITEM.USERS', rout: '/admin/users', icon: 'assets/img/users.png', count: 0},
    {name: 'MENU-ITEM.PUPILS', rout: '/admin/pupils', icon: 'assets/img/pupils.png', count: 0},
    {name: 'MENU-ITEM.TEACHERS', rout: '/admin/teachers', icon: 'assets/img/teachers.png', count: 0}
  ];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getCount().subscribe(res => this.menuItems[0].count = res);
  }
}
