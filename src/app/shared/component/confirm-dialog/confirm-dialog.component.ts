import {ConfirmDialogModel} from '../../model/ConfirmDialogModel';

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  title: string;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
  }
}
