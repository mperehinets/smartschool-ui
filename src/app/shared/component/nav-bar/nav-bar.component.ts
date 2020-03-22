import {AuthService} from '../../service/auth.service';
import {AvatarService} from '../../service/avatar.service';
import {AppConstants} from '../../app-constants';
import {UpdateAvatarComponent} from '../update-avatar/update-avatar.component';
import {User} from '../../model/User';
import {UserService} from '../../service/user.service';

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
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(public authService: AuthService,
              private avatarService: AvatarService,
              private breakpointObserver: BreakpointObserver,
              private translateService: TranslateService,
              private router: Router,
              private dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.languages = this.translateService.getLangs();
    this.currentLang = localStorage.getItem(AppConstants.LANGUAGE_STORAGE_KEY);
    this.userService.findById(this.authService.userPrinciple.id).subscribe(res => {
      this.currentUser = res;
      this.currentAvatar = this.avatarService.getUrlByAvatarName(res.avatarName);
    });
  }


  switchLang(selectedLanguage: string) {
    this.translateService.use(selectedLanguage);
    this.currentLang = selectedLanguage;
    localStorage.setItem('lang', selectedLanguage);
  }

  signIn() {
    this.router.navigate(['/auth/login']);
  }

  signOut() {
    this.authService.signOut();
  }

  onUpdateAvatar() {
    this.userService.populateUpdateAvatarForm(this.currentUser);
    const dialogRef = this.dialog.open(UpdateAvatarComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.currentAvatar = this.avatarService.getUrlByAvatarName(res);
      }
    });
  }
}
