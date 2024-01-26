import { ResourceType } from '../../utils/enums/resourceType.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Types, HydratedDocument } from 'mongoose';

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Resource {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: ResourceType })
  type: ResourceType;

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
