import { Controller, UseGuards, HttpCode, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../utils/guards/jwt/jwtAuth.guard';
import { SharedTasksService } from './sharedTasks.service';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('SharedTasks')
@Controller('sharedTasks')
export class SharedTasksController {
  constructor(private sharedTasksService: SharedTasksService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Shared Task Details',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async findById(@Param() id: string) {
    return this.sharedTasksService.findById(id);
  }
}
