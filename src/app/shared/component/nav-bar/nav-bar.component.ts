import {AuthService} from '../../service/auth.service';
import {AvatarService} from '../../service/avatar.service';
import {AppConstants} from '../../app-constants';
import {UpdateAvatarComponent} from '../update-avatar/update-avatar.component';
import {User} from '../../model/User';

import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentUser: User;
  currentAvatar: string;
  currentLang: string;
  languages: string[];
  isLoggedIn$: Observable<boolean> = this.authService.isLoginSubject;
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  adminMenuItems = [
    {icon: 'group', url: 'admin/home/users', label: 'MENU-ITEM.USERS'},
    {icon: 'school', url: 'admin/home/pupils', label: 'MENU-ITEM.PUPILS'},
    {icon: 'contact_mail', url: 'admin/home/teachers', label: 'MENU-ITEM.TEACHERS'},
    {icon: 'group_work', url: 'admin/home/classes', label: 'MENU-ITEM.CLASSES'},
    {icon: 'class', url: 'admin/home/subjects', label: 'MENU-ITEM.SUBJECTS'},
    {icon: 'calendar_today', url: 'admin/home/templates-schedule', label: 'MENU-ITEM.TEMPLATE-SCHEDULES'},
  ];

  constructor(public authService: AuthService,
              private avatarService: AvatarService,
              private breakpointObserver: BreakpointObserver,
              private translateService: TranslateService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.languages = this.translateService.getLangs();
    this.currentLang = localStorage.getItem(AppConstants.LANGUAGE_STORAGE_KEY);
    this.isLoggedIn$.subscribe(value => {
      if (value) {
        this.authService.getCurrentUser().subscribe(res => {
          this.currentUser = res;
          this.currentAvatar = this.avatarService.getUrlByAvatarName(res.avatarName);
        });
      }
    });

  }

  switchLang(selectedLanguage: string) {
    this.translateService.use(selectedLanguage);
    this.currentLang = selectedLanguage;
    localStorage.setItem('lang', selectedLanguage);
  }

  signOut() {
    this.authService.signOut();
  }

  onUpdateAvatar() {
    const dialogRef = this.dialog.open(UpdateAvatarComponent, {data: this.currentUser});
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.currentAvatar = this.avatarService.getUrlByAvatarName(res);
        this.currentUser.avatarName = res;
      }
    });
  }
}
