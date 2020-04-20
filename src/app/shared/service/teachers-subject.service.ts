import {TeachersSubject} from '../model/TeachersSubject';
import {Subject} from '../model/Subject';
import {Teacher} from '../model/Teacher';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeachersSubjectService {

  constructor(private http: HttpClient) {
  }

  create(teachersSubject: { teacher: Teacher, subject: Subject }): Observable<TeachersSubject> {
    return this.http.post<TeachersSubject>(`/teachers-subjects`, teachersSubject);
  }

  delete(teacherId: number, subjectId: number): Observable<TeachersSubject> {
    return this.http.delete<TeachersSubject>(`/teachers-subjects/${teacherId}/delete-subject/${subjectId}`);
  }

  findByTeacherIdAndSubjectId(teacherId: number, subjectId: number): Observable<TeachersSubject> {
    return this.http.get<TeachersSubject>(`/teachers-subjects/by-teacher-and-subject/${teacherId}/${subjectId}`);
  }

  countByTeacherId(teacherId: number): Observable<number> {
    return this.http.get<number>(`/teachers-subjects/count-by-teacher/${teacherId}`);
  }
}
