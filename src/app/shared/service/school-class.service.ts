import {SchoolClass} from '../model/SchoolClass';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  constructor(private http: HttpClient) {
  }

  create(schoolClass: SchoolClass): Observable<SchoolClass> {
    return this.http.post<SchoolClass>('/school-classes', schoolClass);
  }

  update(schoolClass: SchoolClass): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`/school-classes/${schoolClass.id}`, schoolClass);
  }

  findAll(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>('/school-classes');
  }

  findById(id: number): Observable<SchoolClass> {
    return this.http.get<SchoolClass>(`/school-classes/${id}`);
  }

  findByNumber(classNumber: number): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(`/school-classes/by-number/${classNumber}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`/school-classes/${id}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/school-classes/count`);
  }

  moveOnToNewSchoolYear(ignoreSchedule: boolean): Observable<void> {
    return this.http.put<void>(`/school-classes/move-on-to-new-school-year/${ignoreSchedule}`, null);
  }
}
