import { CategoriesService } from '../categories/categories.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Task, TaskDocument } from './schema/tasks.schema';
import { UsersService } from '../users/users.service';
import { Status } from '../utils/enums/status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { PatchDTO } from './dto/patch.dto';
import { TaskDTO } from './dto/tasks.dto';
import { Model } from 'mongoose';
import {
  HttpBadRequest,
  HttpMongoError,
  HttpNotFound,
} from '../utils/exceptions/http.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(user: string, taskDTO: TaskDTO) {
    taskDTO.endHour <= taskDTO.startHour &&
      HttpBadRequest(
        'La tarea no puede tener una hora fin anterior a la de inicio',
      );

    const userTask = await this.usersService.findByIdAndGetTask(
      user,
      taskDTO.startHour,
      taskDTO.endHour,
    );
    userTask?.length != 0 && HttpBadRequest('La tarea se sobrepone a otra');

    taskDTO.isPeriodical == false &&
      taskDTO.enumPeriodical &&
      HttpBadRequest('La tarea no puede tener dias sin ser periodica');

    const task = await new this.taskModel(taskDTO)
      .save()
      .catch(() => HttpMongoError('Error en la base de datos'));
    this.usersService.addTask(user, task._id.toString());
    return task;
  }

  async findById(id: string) {
    return await this.taskModel
      .findById(id)
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  async patch(task: string, patchDTO: PatchDTO) {
    const tas = await this.taskModel
      .findById(task)
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));

    if (!tas) HttpNotFound('La tarea no existe');

    patchDTO.category &&
      (await this.categoriesService.findById(patchDTO.category));

    return await this.taskModel
      .findByIdAndUpdate(task, patchDTO, { new: true })
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  async delete(taskId: string) {
    return await this.taskModel
      .findByIdAndUpdate(
        taskId,
        { isActive: false, status: Status.Canceled },
        { new: true },
      )
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  async addShareLink(task: string, shareLink: string) {
    return await this.taskModel
      .updateOne(
        { _id: task },
        { $addToSet: { shareLinks: shareLink } },
        { new: true },
      )
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }
}
