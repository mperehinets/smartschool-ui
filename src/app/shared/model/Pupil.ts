import {User} from './User';
import {SchoolClass} from './SchoolClass';

export interface Pupil extends User {
  schoolClass: SchoolClass;
}
