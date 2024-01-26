import MongooseClassSerializerInterceptor from '../utils/interceptors/mongooseClassSerializer.interceptor';
import { UserRequest } from '../utils/interfaces/requestUser.interface';
import { LocalAuthGuard } from '../utils/guards/local/localAuth.guard';
import { Public } from '../utils/decorators/public.decorator';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { User } from '../users/schema/users.schema';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import {
  UseInterceptors,
  Controller,
  HttpCode,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: 'User Login to Get an Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: UserRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  @ApiBody({ type: RegisterDTO })
  @ApiCreatedResponse({
    description: 'User Registered',
  })
  @Public()
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }
}
