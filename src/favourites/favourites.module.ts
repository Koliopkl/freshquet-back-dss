import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { Favourites, FavouritesSchema } from './schema/favourites.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Favourites.name, schema: FavouritesSchema },
    ]),
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
