import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Types, HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Category {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  color: string;

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
