import {BaseModel} from './BaseModel';
import {TeachersSubject} from './TeachersSubject';


export interface TemplateSchedule extends BaseModel {
  classNumber: number;
  dayOfWeek: string;
  lessonNumber: number;
  teachersSubject: TeachersSubject;
  isValid?: boolean;
}
