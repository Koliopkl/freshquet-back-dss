import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Advertisement,
  AdvertisementSchema,
} from 'src/advertisements/schema/advertisement.schema';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { Compra, CompraSchema } from './schema/compra.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Compra.name, schema: CompraSchema }]),
    MongooseModule.forFeature([
      { name: Advertisement.name, schema: AdvertisementSchema },
    ]),
  ],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}
