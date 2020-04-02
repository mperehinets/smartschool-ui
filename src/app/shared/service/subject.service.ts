import {ModelStatus} from '../model/ModelStatus';
import {Subject} from '../model/Subject';

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) {
  }

  create(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>('/subjects', subject);
  }

  update(subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(`/subjects/${subject.id}`, subject);
  }

  findAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>('/subjects');
  }

  findByStatus(status: ModelStatus): Observable<Subject[]> {
    return this.http.get<Subject[]>('/subjects/', {params: new HttpParams().set('status', status)});
  }

  findByTeacherId(teacherId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`/subjects/by-teacher/${teacherId}`);
  }

  changeStatusById(body: { id: number, newStatus: ModelStatus }): Observable<void> {
    return this.http.put<void>(`/subjects/change-status/${body.id}`, body);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/subjects/count`);
  }
}
