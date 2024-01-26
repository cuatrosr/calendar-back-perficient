import { User } from '../../users/schema/users.schema';
import { Request } from 'express';

export interface UserRequest extends Request {
  user: User;
}
