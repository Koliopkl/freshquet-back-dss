import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CompraDocument = Compra & Document;

@Schema()
export class Compra {
  @Prop({ required: true, ref: 'Advertisement' })
  adv_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  seller_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  buyer_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  is_ended: boolean;

  @Prop({ required: true })
  confirmation_code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  price: number;

  @Prop()
  review: number;

  @Prop()
  review_text: string;
}

export const CompraSchema = SchemaFactory.createForClass(Compra);
