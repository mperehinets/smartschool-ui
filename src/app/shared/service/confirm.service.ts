import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';

import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private dialog: MatDialog,
              private translate: TranslateService) {
  }

  confirm(title: string, message: string, translate: boolean): MatDialogRef<ConfirmDialogComponent> {
    if (translate) {
      title = this.translate.instant(title);
      message = this.translate.instant(message);
    }
    return this.dialog.open(ConfirmDialogComponent, {
      data: {title, message},
      panelClass: 'confirm-dialog'
    });
  }
}
