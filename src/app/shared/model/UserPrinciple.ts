import {BaseModel} from './BaseModel';

export interface UserPrinciple extends BaseModel {
  firstName: string;
  secondName: string;
  avatarName: string;
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}
