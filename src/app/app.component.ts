import {AppConstants} from './shared/app-constants';

import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.addLangs(['en', 'uk']);
    this.translate.setDefaultLang('en');
    let lang = localStorage.getItem(AppConstants.LANGUAGE_STORAGE_KEY);
    if (lang == null) {
      localStorage.setItem(AppConstants.LANGUAGE_STORAGE_KEY, 'en');
      lang = 'en';
    }
    this.translate.use(lang);
  }
}
