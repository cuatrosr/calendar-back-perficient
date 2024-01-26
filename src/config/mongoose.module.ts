import { ResourceSchema, Resource } from '../resources/schema/resources.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { Task, TaskSchema } from '../tasks/schema/tasks.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  SharedTaskSchema,
  SharedTask,
} from '../sharedTasks/schema/sharedTasks.schema';
import {
  ShareLinkSchema,
  ShareLink,
} from '../shareLinks/schema/shareLinks.schema';
import {
  CategorySchema,
  Category,
} from '../categories/schema/categories.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: `${config.get('database.host')}`,
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: SharedTask.name,
        schema: SharedTaskSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: ShareLink.name,
        schema: ShareLinkSchema,
      },
      {
        name: Resource.name,
        schema: ResourceSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseConfigModule {}
