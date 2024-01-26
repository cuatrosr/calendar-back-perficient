import { SharedTasksService } from '../../sharedTasks/sharedTasks.service';
import { ExtendedRequest } from '../interfaces/request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Response, NextFunction } from 'express';

@Injectable()
export class TaskRoleMiddleware implements NestMiddleware {
  constructor(private moduleRef: ModuleRef) {}

  async use(req: ExtendedRequest, _res: Response, next: NextFunction) {
    const contextId = ContextIdFactory.getByRequest(req);
    const sharedTaskService = await this.moduleRef.resolve(
      SharedTasksService,
      contextId,
    );
    const id = req.params.id;
    const sharedTasks = await sharedTaskService.findById(id);
    req.user.role = sharedTasks.role;
    next();
  }
}
