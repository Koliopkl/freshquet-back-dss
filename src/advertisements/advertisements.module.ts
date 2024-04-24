import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Compra, CompraSchema } from 'src/compra/schema/compra.schema';
import { AdvertisementsController } from './advertisements.controller';
import { AdvertisementsService } from './advertisements.service';
import {
  Advertisement,
  AdvertisementSchema,
} from './schema/advertisement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Advertisement.name, schema: AdvertisementSchema },
    ]),
    MongooseModule.forFeature([{ name: Compra.name, schema: CompraSchema }]),
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
  exports: [AdvertisementsService],
})
export class AdvertisementsModule {}
