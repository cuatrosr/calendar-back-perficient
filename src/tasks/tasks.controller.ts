import MongooseClassSerializerInterceptor from '../utils/interceptors/mongooseClassSerializer.interceptor';
import { UserDecorator } from '../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt/jwtAuth.guard';
import { UserType } from '../utils/interfaces/user.interface';
import { TasksService } from './tasks.service';
import { Task } from './schema/tasks.schema';
import { PatchDTO } from './dto/patch.dto';
import { TaskDTO } from './dto/tasks.dto';
import {
  UseInterceptors,
  Controller,
  UseGuards,
  HttpCode,
  Patch,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseInterceptors(MongooseClassSerializerInterceptor(Task))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: TaskDTO })
  @ApiOkResponse({
    description: 'Category Created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async create(@UserDecorator() user: UserType, @Body() task: TaskDTO) {
    return this.tasksService.create(user.sub, task);
  }

  @Patch(':taskId')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Task Property is Modified',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async patch(@Param('taskId') taskId: string, @Body() patch: PatchDTO) {
    return this.tasksService.patch(taskId, patch);
  }

  @Delete(':taskId')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Task is deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async delete(@Param('taskId') taskId: string) {
    return this.tasksService.delete(taskId);
  }
}
