import { MongooseConfigModule } from '../config/mongoose.module';
import { ShareLinksController } from './shareLinks.controller';
import { ShareLinksService } from './shareLinks.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [MongooseConfigModule, forwardRef(() => TasksModule)],
  providers: [ShareLinksService],
  controllers: [ShareLinksController],
  exports: [ShareLinksService],
})
export class ShareLinksModule {}
