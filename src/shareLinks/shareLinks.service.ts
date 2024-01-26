import { ShareLink, ShareLinkDocument } from './schema/shareLinks.schema';
import { UserType } from '../utils/interfaces/user.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { TasksService } from '../tasks/tasks.service';
import { ShareLinkDTO } from './dto/shareLink.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  HttpMongoError,
  HttpNotFound,
} from '../utils/exceptions/http.exception';

@Injectable()
export class ShareLinksService {
  constructor(
    @InjectModel(ShareLink.name)
    private readonly shareLinkModel: Model<ShareLinkDocument>,
    private tasksService: TasksService,
    private readonly mailerService: MailerService,
  ) {}

  async create(user: UserType, taskId: string, shareLinkDTO: ShareLinkDTO) {
    const task = await this.tasksService.findById(taskId);
    if (!task) return HttpNotFound('Task no existe');
    const shareLink = await new this.shareLinkModel(shareLinkDTO)
      .save()
      .catch(() => HttpMongoError('Error en la base de datos'));
    await this.tasksService.addShareLink(taskId, shareLink._id.toString());
    this.sendMail(
      shareLinkDTO.email,
      user.username,
      task.title,
      'http://www.google.com',
    );
  }

  async sendMail(to: string, email: string, title: string, link: string) {
    await this.mailerService.sendMail({
      to: to,
      from: '"Calendar Perficient 👻" <cuatro04sr@gmail.com>',
      subject: 'Task Invitation',
      html: `<p>Hi there!</p>
      <p>The user <b>${email}</b> invited you to his task:</p>
      <p><strong>Task Title:</strong> ${title}</p>
      <p><strong>Accept Invite:</strong> <a href="${link}">${link}</a></p>
      <p><b>Best regards</b></p>`,
    });
  }
}
