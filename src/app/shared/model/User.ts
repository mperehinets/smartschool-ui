import {BaseModel} from './BaseModel';
import {ModelStatus} from './ModelStatus';
import {Role} from './Role';

export interface User extends BaseModel {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  dateBirth: Date;
  avatarName: string;
  status: ModelStatus;
  roles: Role[];
}
