import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('en');
    let lang = localStorage.getItem('lang');
    if (lang == null) {
      localStorage.setItem('lang', 'en');
      lang = 'en';
    }
    translate.use(lang);
  }
}
