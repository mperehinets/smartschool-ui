import {TemplateSchedule} from '../model/TemplateSchedule';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateScheduleService {

  constructor(private http: HttpClient) {
  }

  create(templateSchedule: TemplateSchedule): Observable<TemplateSchedule> {
    return this.http.post<TemplateSchedule>('/templates-schedule', templateSchedule);
  }

  update(templateSchedule: TemplateSchedule): Observable<TemplateSchedule> {
    return this.http.put<TemplateSchedule>(`/templates-schedule/${templateSchedule.id}`, templateSchedule);
  }

  updateAll(templatesSchedule: TemplateSchedule[]): Observable<TemplateSchedule[]> {
    return this.http.put<TemplateSchedule[]>(`/templates-schedule`, templatesSchedule);
  }

  findAll(): Observable<TemplateSchedule[]> {
    return this.http.get<TemplateSchedule[]>('/templates-schedule');
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/templates-schedule/count`);
  }

  findByClassNumber(classNumber: number): Observable<TemplateSchedule[]> {
    return this.http.get<TemplateSchedule[]>(`/templates-schedule/by-class-number/${classNumber}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`/templates-schedule/${id}`);
  }
}
