import { MongooseConfigModule } from '../config/mongoose.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { UsersModule } from '../users/users.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [MongooseConfigModule, forwardRef(() => UsersModule)],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
