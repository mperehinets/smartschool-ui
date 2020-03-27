import {BaseModel} from './BaseModel';
import {ModelStatus} from './ModelStatus';

export interface Subject extends BaseModel {
  name: string;
  status: ModelStatus;
}
