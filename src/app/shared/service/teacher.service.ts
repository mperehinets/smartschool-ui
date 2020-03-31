import {Teacher} from '../model/Teacher';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) {
  }

  create(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`/teachers`, teacher);
  }

  update(teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`/teachers/${teacher.id}`, teacher);
  }

  findAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>('/teachers');
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/teachers/count`);
  }
}
