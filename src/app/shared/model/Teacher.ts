import {User} from './User';

export interface Teacher extends User {
  education: string;
  subjectsCount: number;
}
