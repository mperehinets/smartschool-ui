import {SchoolClass} from '../model/SchoolClass';
import {TemplateSchedule} from '../model/TemplateSchedule';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }

  generateSchedule(generateSchedule: {
    startDate: Date,
    endDate: Date,
    schoolClass: SchoolClass,
    templatesSchedule: TemplateSchedule[]
  }): Observable<void> {
    return this.http.post<void>('/schedules/generate-schedule', generateSchedule);
  }

  findMinGenerationDateByClassId(classId: number): Observable<Date> {
    return this.http.get<Date>(`/schedules/min-generation-date-by-class/${classId}`);
  }
}
