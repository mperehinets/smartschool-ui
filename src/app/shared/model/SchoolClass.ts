import {BaseModel} from './BaseModel';
import {Teacher} from './Teacher';

export interface SchoolClass extends BaseModel {
  initial: string;
  number: number;
  classTeacher: Teacher;
  countPupils: number;
}
