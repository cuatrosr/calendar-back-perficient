import { Category, CategoryDocument } from './schema/categories.schema';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CategoryDTO } from './dto/category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HttpBadRequest,
  HttpMongoError,
  HttpNotFound,
} from '../utils/exceptions/http.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findById(id: string) {
    return (
      (await this.categoryModel
        .findById(id)
        .exec()
        .catch(() => HttpMongoError('Error en la base de datos'))) ||
      HttpNotFound('La categoria no se encontro en la base de datos')
    );
  }

  async create(user: string, category: CategoryDTO) {
    const userCat = await this.usersService.findByIdAndGetCategory(
      user,
      category.name,
    );
    !userCat?.length && HttpBadRequest('La categoria ya existe');
    const cat = await new this.categoryModel(category)
      .save()
      .catch(() => HttpMongoError('Error en la base de datos'));
    this.usersService.addCategory(user, cat._id.toString());
    return cat;
  }
}
