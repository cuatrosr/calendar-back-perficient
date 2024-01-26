import { MongooseConfigModule } from '../config/mongoose.module';
import { SharedTasksController } from './sharedTasks.controller';
import { SharedTasksService } from './sharedTasks.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseConfigModule],
  providers: [SharedTasksService],
  controllers: [SharedTasksController],
  exports: [SharedTasksService],
})
export class SharedTasksModule {}
