import {BaseModel} from './BaseModel';

export interface UserPrinciple extends BaseModel {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}
