import {Schedule} from '../model/Schedule';

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }

  create(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>('/schedules', schedule);
  }

  update(schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`/schedules/${schedule.id}`, schedule);
  }

  findAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>('/schedules');
  }

  findById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`/schedules/${id}`);
  }

  deleteById(id: number): Observable<Schedule> {
    return this.http.delete<Schedule>(`/schedules/${id}`);
  }

  updateAll(schedules: Schedule[]): Observable<Schedule[]> {
    return this.http.put<Schedule[]>(`/schedules`, schedules);
  }

  findLastByClassId(classId: number): Observable<Schedule> {
    return this.http.get<Schedule>(`/schedules/last-by-class/${classId}`);
  }

  findByClassIdAndDate(classId: number, date: Date): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`/schedules/by-class/${classId}/and-date/${moment(date).format('YYYY-MM-DD')}`);
  }

  canTeacherHoldLesson(teacherId: number, date: Date, lessonNumber: number): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('teacherId', `${teacherId}`);
    params = params.append('date', moment(date).format('YYYY-MM-DD'));
    params = params.append('lessonNumber', `${lessonNumber}`);
    return this.http.get<boolean>('/schedules/can-teacher-hold-lesson', {params});
  }
}
