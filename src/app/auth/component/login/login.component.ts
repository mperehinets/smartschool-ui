import {AuthService} from '../../../shared/service/auth.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {ForgotPasswordComponent} from '../../../shared/component/forgot-password/forgot-password.component';

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  form: FormGroup;
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

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private authService: AuthService,
              private notification: NotificationService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
    });
  }

  signIn(): void {
    this.authService.signIn(this.form.value);
  }

  onForgotPassword() {
    this.dialog.open(ForgotPasswordComponent);
  }
}
