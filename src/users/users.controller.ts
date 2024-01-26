import MongooseClassSerializerInterceptor from '../utils/interceptors/mongooseClassSerializer.interceptor';
import { UserDecorator } from '../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt/jwtAuth.guard';
import { UserType } from '../utils/interfaces/user.interface';
import { UsersService } from './users.service';
import { User } from './schema/users.schema';
import {
  UseInterceptors,
  Controller,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'User Details',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async getProfile(@UserDecorator() user: UserType) {
    return this.usersService.findById(user.sub);
  }
}
