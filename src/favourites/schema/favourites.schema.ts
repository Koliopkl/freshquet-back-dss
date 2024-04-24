import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FavouritesDocument = Favourites & Document;

@Schema()
export class Favourites {
  @Prop({ required: true })
  user_id: string;

  @Prop()
  favourites: string[];
}

export const FavouritesSchema = SchemaFactory.createForClass(Favourites);
