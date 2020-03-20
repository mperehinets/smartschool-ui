import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private translate: TranslateService,
              private toastr: ToastrService) {
  }

  showSuccessTranslateMsg(msgKey: string) {
    this.translate.get(msgKey).subscribe(
      msg => this.toastr.success(msg)
    );
  }

  showSuccessMsg(msg: string) {
    this.toastr.success(msg);
  }

  showErrorTranslateMsg(msgKey: string) {
    this.translate.get(msgKey).subscribe(
      msg => this.toastr.error(msg)
    );
  }

  showErrorMsg(msg: string) {
    this.toastr.error(msg);
  }
}
