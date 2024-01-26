import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User, UserDocument } from './schema/users.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegisterDTO } from '../auth/dto/register.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { TasksService } from '../tasks/tasks.service';
import { Status } from '../utils/enums/status.enum';
import { PatchDTO } from '../tasks/dto/patch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HttpBadRequest,
  HttpMongoError,
  HttpNotFound,
} from '../utils/exceptions/http.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  async create(user: RegisterDTO) {
    (await this.userModel
      .findOne({ username: user.username })
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'))) &&
      HttpBadRequest('El username ya existe');
    return await new this.userModel(user)
      .save()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  async findById(id: string) {
    return (
      (await this.userModel
        .findById(id)
        .populate([
          {
            path: 'tasks',
            match: { isActive: true },
            select:
              'title displayInfo color status startHour endHour isPeriodical enumPeriodical category',
            populate: {
              path: 'category',
              select: 'name',
            },
          },
          {
            path: 'sharedTasks',
            match: { isActive: true },
            select: 'task role',
            populate: [
              {
                path: 'task',
                select: 'title',
              },
            ],
          },
          {
            path: 'categories',
            select: 'name',
          },
        ])
        .exec()
        .catch(() => HttpMongoError('Error en la base de datos'))) ||
      HttpNotFound('El usuario no existe')
    );
  }

  async findByIdAndGetCategory(id: string, name: string) {
    const usr = await this.userModel
      .findById(id)
      .populate({
        path: 'categories',
        select: 'name',
      })
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
    return usr?.categories.filter((cat) => cat.name == name);
  }

  async findByIdAndGetTask(id: string, startHour: Date, endHour: Date) {
    const usr = await this.userModel
      .findById(id)
      .populate({
        path: 'tasks',
        select: 'startHour endHour',
      })
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
    return usr?.tasks.filter(
      (task) =>
        (task.startHour < startHour && task.endHour > startHour) ||
        (task.startHour < endHour && task.endHour > endHour) ||
        (task.startHour >= startHour && task.endHour <= endHour),
    );
  }

  async findAllAndGetTasks(now: Date, reminderTime: Date) {
    const users =
      (await this.userModel
        .find({
          tasks: {
            $exists: true,
            $not: { $size: 0 },
          },
        })
        .populate({
          path: 'tasks',
          match: {
            isActive: true,
            startHour: { $gt: now, $lte: reminderTime },
          },
          select: 'title startHour endHour',
        })
        .exec()
        .catch(() => HttpMongoError('Error en la base de datos'))) ||
      HttpNotFound('El usuario no existe');
    return users.filter((user) => user.tasks.length > 0);
  }

  async findAllAndGetTasksAfter(now: Date, reminderTime: Date) {
    const users =
      (await this.userModel
        .find({
          tasks: {
            $exists: true,
            $not: { $size: 0 },
          },
        })
        .populate({
          path: 'tasks',
          match: {
            isActive: true,
            endHour: { $lt: now, $gte: reminderTime },
          },
          select: 'title startHour endHour isPeriodical enumPeriodical',
        })
        .exec()
        .catch(() => HttpMongoError('Error en la base de datos'))) ||
      HttpNotFound('El usuario no existe');
    return users.filter((user) => user.tasks.length > 0);
  }

  async findByUsername(username: string) {
    return (
      (await this.userModel
        .findOne({ username: username })
        .exec()
        .catch(() => HttpMongoError('Error en la base de datos'))) ||
      HttpNotFound('El usuario no existe')
    );
  }

  async addCategory(user: string, category: string) {
    return await this.userModel
      .updateOne(
        { _id: user },
        { $addToSet: { categories: category } },
        { new: true },
      )
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  async addTask(user: string, task: string) {
    return await this.userModel
      .updateOne({ _id: user }, { $addToSet: { tasks: task } }, { new: true })
      .exec()
      .catch(() => HttpMongoError('Error en la base de datos'));
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCronBefore() {
    this.checkAndCacheTasks();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCronAfter() {
    this.checkTasks();
  }

  async checkAndCacheTasks() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 30 * 60000);
    const users = await this.findAllAndGetTasks(now, reminderTime);
    users.forEach((user) =>
      user.tasks.forEach(async (task) => {
        this.sendMail(user.email, task.title, task.startHour);
        const patchDTO = new PatchDTO();
        patchDTO.status = Status.InProgress;
        await this.tasksService.patch(task._id.toString(), patchDTO);
      }),
    );
  }

  async checkTasks() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() - 30 * 60000);
    const users = await this.findAllAndGetTasksAfter(now, reminderTime);
    users.forEach((user) =>
      user.tasks.forEach(async (task) => {
        if (!task.isPeriodical) {
          const patchDTO = new PatchDTO();
          patchDTO.isActive = false;
          await this.tasksService.patch(task._id.toString(), patchDTO);
        } else {
          const newDate = this.getNextClosestDayFromDate(
            now,
            task.enumPeriodical,
          );
          const startHour = task.startHour;
          startHour.setFullYear(newDate.getFullYear());
          startHour.setMonth(newDate.getMonth());
          startHour.setDate(newDate.getDate());
          const endHour = task.endHour;
          endHour.setFullYear(newDate.getFullYear());
          endHour.setMonth(newDate.getMonth());
          endHour.setDate(newDate.getDate());
          const patchDTO = new PatchDTO();
          patchDTO.startHour = startHour;
          patchDTO.endHour = endHour;
          patchDTO.status = Status.Finished;
          await this.tasksService.patch(task._id.toString(), patchDTO);
        }
      }),
    );
  }
  getNextClosestDayFromDate(date: Date, targetDays: string[]) {
    const DaysOfWeekMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const currentDay = date.getDay();
    const nextOccurrences = targetDays.map((targetDay) => {
      const dayDifference = (DaysOfWeekMap[targetDay] - currentDay + 7) % 7;
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + dayDifference);
      return nextDate;
    });

    const minDifference = Math.min(
      ...nextOccurrences.map(
        (occurrence) => occurrence.getTime() - date.getTime(),
      ),
    );

    const closestIndex = nextOccurrences.findIndex(
      (occurrence) => occurrence.getTime() - date.getTime() === minDifference,
    );

    return nextOccurrences[closestIndex];
  }

  async sendMail(to: string, title: string, startHour: Date) {
    await this.mailerService.sendMail({
      to: to,
      from: '"Calendar Perficient 👻" <cuatro04sr@gmail.com>',
      subject: 'Event Reminder',
      html: `<p>Hi there!</p>
      <p>This is a reminder for your upcoming event:</p>
      <p><strong>Event Name:</strong> ${title}</p>
      <p><strong>Date and Time:</strong> ${startHour.toLocaleString('en-US', {
        timeZone: 'America/Bogota',
      })}</p>
      <p>The event is scheduled to start soon. Don't forget to prepare!</p>
      <p><b>Best regards</b></p>`,
    });
  }
}
