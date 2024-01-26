import { MongooseConfigModule } from '../config/mongoose.module';
import { UsersController } from './users.controller';
import { TasksModule } from '../tasks/tasks.module';
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseConfigModule, forwardRef(() => TasksModule)],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
