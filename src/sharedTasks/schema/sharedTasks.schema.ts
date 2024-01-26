import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Types, HydratedDocument } from 'mongoose';
import { Task } from '../../tasks/schema/tasks.schema';
import { Role } from '../../utils/enums/role.enum';

export type SharedTaskDocument = HydratedDocument<SharedTask>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class SharedTask {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: Task.name } })
  task: Task;

  @Prop({ type: String, enum: Role })
  role: Role;

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const SharedTaskSchema = SchemaFactory.createForClass(SharedTask);
