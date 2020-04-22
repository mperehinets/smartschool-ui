import {Schedule} from '../model/Schedule';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }

  findLastByClassId(classId: number): Observable<Schedule> {
    return this.http.get<Schedule>(`/schedules/last-by-class/${classId}`);
  }
}
