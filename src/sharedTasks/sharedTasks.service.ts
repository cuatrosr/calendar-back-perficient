import { SharedTask, SharedTaskDocument } from './schema/sharedTasks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  HttpMongoError,
  HttpNotFound,
} from '../utils/exceptions/http.exception';

@Injectable()
export class SharedTasksService {
  constructor(
    @InjectModel(SharedTask.name)
    private readonly sharedTaskModel: Model<SharedTaskDocument>,
  ) {}

  async findById(id: string) {
    return (
      (await this.sharedTaskModel
        .findById(id)
        .exec()
        .catch(() => HttpMongoError(SharedTask.name))) ||
      HttpNotFound(SharedTask.name)
    );
  }
}
