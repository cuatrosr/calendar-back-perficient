import { CategoriesModule } from '../categories/categories.module';
import { MongooseConfigModule } from '../config/mongoose.module';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseConfigModule,
    forwardRef(() => UsersModule),
    CategoriesModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
