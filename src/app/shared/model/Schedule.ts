import {BaseModel} from './BaseModel';
import {SchoolClass} from './SchoolClass';
import {TeachersSubject} from './TeachersSubject';

export interface Schedule extends BaseModel {
  date: Date;
  lessonNumber: number;
  schoolClass: SchoolClass;
  teachersSubject: TeachersSubject;
}
