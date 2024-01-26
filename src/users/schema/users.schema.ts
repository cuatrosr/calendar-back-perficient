import { SharedTask } from '../../sharedTasks/schema/sharedTasks.schema';
import { Category } from '../../categories/schema/categories.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Types, HydratedDocument } from 'mongoose';
import { Task } from '../../tasks/schema/tasks.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class User {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Task.name }],
  })
  tasks: Task[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: SharedTask.name }],
  })
  sharedTasks: SharedTask[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
  })
  categories: Category[];

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
