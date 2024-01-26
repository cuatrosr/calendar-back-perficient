import MongooseClassSerializerInterceptor from '../utils/interceptors/mongooseClassSerializer.interceptor';
import { UserDecorator } from '../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt/jwtAuth.guard';
import { UserType } from '../utils/interfaces/user.interface';
import { CategoriesService } from './categories.service';
import { Category } from './schema/categories.schema';
import { CategoryDTO } from './dto/category.dto';
import {
  UseInterceptors,
  Controller,
  UseGuards,
  HttpCode,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
@UseInterceptors(MongooseClassSerializerInterceptor(Category))
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CategoryDTO })
  @ApiOkResponse({
    description: 'Category Created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async create(@UserDecorator() user: UserType, @Body() category: CategoryDTO) {
    return this.categoriesService.create(user.sub, category);
  }
}
