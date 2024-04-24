import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { UploadController } from './upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CompraModule } from './compra/compra.module';
import { FavouritesModule } from './favourites/favourites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/config/dev.env',
    }),
    MongooseModule.forRoot(
      'mongodb+srv://FRESHQUET_ADMIN:FRESHQUET_PIN_2022@cluster0.sgxmeve.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    UsersModule,
    AdvertisementsModule,
    CompraModule,
    MulterModule.register({
      dest: './uploads',
    }),
    FavouritesModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
