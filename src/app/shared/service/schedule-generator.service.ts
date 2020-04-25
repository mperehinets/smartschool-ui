import {SchoolClass} from '../model/SchoolClass';
import {TemplateSchedule} from '../model/TemplateSchedule';

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleGeneratorService {

  constructor(private http: HttpClient) {
  }

  generateSchedule(generateSchedule: {
    startDate: Date,
    endDate: Date,
    schoolClass: SchoolClass,
    templatesSchedule: TemplateSchedule[]
  }): Observable<void> {
    generateSchedule.startDate = new Date(moment(generateSchedule.startDate).format('YYYY-MM-DD'));
    generateSchedule.endDate = new Date(moment(generateSchedule.endDate).format('YYYY-MM-DD'));
    return this.http.post<void>('/schedule-generator', generateSchedule);
  }

  canTeacherHoldLesson(templateSchedule: TemplateSchedule, startDate: Date, endDate: Date): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('startDate', moment(startDate).format('YYYY-MM-DD'));
    params = params.append('endDate', moment(endDate).format('YYYY-MM-DD'));
    return this.http.post<boolean>('/schedule-generator/check-valid', templateSchedule, {params});
  }
}
