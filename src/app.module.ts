import { SharedTasksController } from './sharedTasks/sharedTasks.controller';
import { TaskRoleMiddleware } from './utils/middlewares/taskRole.middleware';
import { SharedTasksModule } from './sharedTasks/sharedTasks.module';
import { ShareLinksModule } from './shareLinks/shareLinks.module';
import configuration from './config/enviroment.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
  Module,
} from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'test@gmail.com',
          pass: '---- ---- ---- ----',
        },
      },
    }),
    ScheduleModule.forRoot(),
    MongooseModule,
    AuthModule,
    SharedTasksModule,
    ShareLinksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TaskRoleMiddleware)
      .exclude({ path: 'sharedTasks', method: RequestMethod.POST })
      .forRoutes(SharedTasksController);
  }
}
