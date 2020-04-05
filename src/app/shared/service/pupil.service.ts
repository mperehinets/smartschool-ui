import {Pupil} from '../model/Pupil';

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PupilService {

  constructor(private http: HttpClient) {
  }

  create(pupil: Pupil): Observable<Pupil> {
    return this.http.post<Pupil>(`/pupils`, pupil);
  }

  update(pupil: Pupil): Observable<Pupil> {
    return this.http.put<Pupil>(`/pupils/${pupil.id}`, pupil);
  }

  findAll(): Observable<Pupil[]> {
    return this.http.get<Pupil[]>('/pupils');
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`/pupils/count`);
  }
}
