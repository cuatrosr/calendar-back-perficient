import { UserType } from './user.interface';
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user: UserType;
}
