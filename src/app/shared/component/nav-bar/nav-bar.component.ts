import {AuthService} from '../../service/auth.service';

import {Component} from '@angular/core';
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
export class NavBarComponent {

  currentLang: string;
  languages: string[];

  constructor(private breakpointObserver: BreakpointObserver,
              private translateService: TranslateService,
              private router: Router,
              public authService: AuthService) {
    this.languages = translateService.getLangs();
    this.currentLang = localStorage.getItem('lang');
  }

  isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

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
