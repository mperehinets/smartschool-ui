import {AuthService} from '../../service/auth.service';
import {AvatarService} from '../../service/avatar.service';
import {AppConstants} from '../../app-constants';

import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentLang: string;
  languages: string[];

  constructor(private breakpointObserver: BreakpointObserver,
              private translateService: TranslateService,
              private router: Router,
              public avatarService: AvatarService,
              public authService: AuthService) {
  }

  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.languages = this.translateService.getLangs();
    this.currentLang = localStorage.getItem(AppConstants.LANGUAGE_STORAGE_KEY);
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
}
