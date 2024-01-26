import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Types, HydratedDocument } from 'mongoose';

export type ShareLinkDocument = HydratedDocument<ShareLink>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class ShareLink {
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ default: true })
  @Exclude()
  isActive: boolean;
}

export const ShareLinkSchema = SchemaFactory.createForClass(ShareLink);
