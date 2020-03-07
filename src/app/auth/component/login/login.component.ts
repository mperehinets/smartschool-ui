import {AppConstants} from '../../../shared/app-constants';
import {NotificationService} from '../../../shared/service/notification.service';
import {AuthService} from '../../../shared/service/auth.service';

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true;

  constructor(private breakpointObserver: BreakpointObserver,
              private notificationService: NotificationService,
              private router: Router,
              private authService: AuthService
  ) {
  }

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

  ngOnInit(): void {
  }

  signIn(loginForm: NgForm): void {
    this.authService.signIn(loginForm.value).subscribe(
      res => {
        localStorage.setItem(AppConstants.JWT_STORAGE_KEY, res.token);
        if (this.authService.userPrinciple.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        }
      },
      err => {
        this.notificationService.infoNotification(err.error.message);
        loginForm.reset();
      }
    );
  }
}
