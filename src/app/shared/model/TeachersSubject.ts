import {BaseModel} from './BaseModel';
import {ModelStatus} from './ModelStatus';
import {Teacher} from './Teacher';
import {Subject} from './Subject';

export interface TeachersSubject extends BaseModel {
  teacher: Teacher;
  subject: Subject;
  status: ModelStatus;
}
