import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as SchemaMongo } from 'mongoose';
import { Category } from 'src/shared/interfaces/category';

export type AdvertisementDocument = Advertisement & Document;

@Schema()
export class Advertisement {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  pricePerKilogram: number;

  @Prop({ required: true })
  category: Category;

  @Prop({ required: true, ref: 'User' })
  sellerId: mongoose.Schema.Types.ObjectId;

  @Prop()
  reviews: [{ type: SchemaMongo.Types.ObjectId; ref: 'Compra' }];

  @Prop()
  averageReviewScore: number;

  @Prop()
  pictures: string[];
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);
