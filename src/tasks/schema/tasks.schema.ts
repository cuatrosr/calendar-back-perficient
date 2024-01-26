import mongoose, { Types, HydratedDocument, ObjectId } from 'mongoose';
import { ShareLink } from '../../shareLinks/schema/shareLinks.schema';
import { Category } from '../../categories/schema/categories.schema';
import { Resource } from '../../resources/schema/resources.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Status } from '../../utils/enums/status.enum';
import { Day } from '../../utils/enums/day.enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Task {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  displayInfo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop({ type: String, enum: Status, default: Status.Pending })
  status: Status;

  @Prop({ required: false })
  color: string;

  @Prop({ require: true, type: mongoose.Schema.Types.Date })
  startHour: Date;

  @Prop({ require: true, type: mongoose.Schema.Types.Date })
  endHour: Date;

  @Prop({ required: true })
  isPeriodical: boolean;

  @Prop([{ type: String, enum: Day }])
  enumPeriodical: Day[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: ShareLink.name }],
  })
  @Type(() => String)
  @Transform(({ value }) =>
    value.map((objectId: ObjectId) => objectId.toString()),
  )
  shareLinks: ShareLink[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Resource.name }],
  })
  @Type(() => String)
  @Transform(({ value }) =>
    value.map((objectId: ObjectId) => objectId.toString()),
  )
  resources: Resource[];

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
