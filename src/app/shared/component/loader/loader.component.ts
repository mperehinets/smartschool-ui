import {LoaderService} from '../../service/loader.service';

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading.pipe(
      delay(0)
    );
  }

}
