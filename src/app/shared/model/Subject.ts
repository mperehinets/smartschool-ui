import {BaseModel} from './BaseModel';
import {ModelStatus} from './ModelStatus';
import {Teacher} from './Teacher';

export interface Subject extends BaseModel {
  name: string;
  status: ModelStatus;
  teachers?: Teacher[];
}
