import {BaseModel} from './BaseModel';
import {Subject} from './Subject';


export interface TemplateSchedule extends BaseModel {
  classNumber: number;
  dayOfWeek: string;
  lessonNumber: number;
  subject: Subject;
}
