import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  profile_picture: string;

  @Prop()
  direction: string;

  @Prop()
  biography: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  extra_data;

  @Prop({ required: true, type: String, enum: ['buyer', 'seller'] })
  userType: string;

  @Prop()
  adsInSeeLater: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
