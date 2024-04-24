import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { FavouritesDTO } from './dto/favourites.dto';
import { FavouritesService } from './favourites.service';

@Controller('favourites')
export class FavouritesController {
  constructor(
    private readonly favouritesService: FavouritesService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':id')
  async getFavourites(@Param('id') id: string) {
    const allFavs = await this.favouritesService.getFavourites(id);
    let favourites = [];
    for (let i = 0; i < allFavs[0].favourites.length; i++) {
      const user = this.usersService.findById(allFavs[0].favourites[i]);
      favourites.push(user);
    }
    return Promise.all(favourites).then((values) => {
      return values;
    });
  }

  @Get(':id/:favourite_id')
  async checkFavourite(
    @Param('id') id: string,
    @Param('favourite_id') favourite_id: string,
  ) {
    return await this.favouritesService.checkFavourite(id, favourite_id);
  }

  @Post()
  async handleFavourites(@Body() data: FavouritesDTO) {
    return await this.favouritesService.addFavourite(
      data.user_id,
      data.favourite_id,
    );
  }

  @Delete(':id/:favourite_id')
  async deleteFavourite(
    @Param('id') id: string,
    @Param('favourite_id') favourite_id: string,
  ) {
    return await this.favouritesService.deleteFavourite(id, favourite_id);
  }
}
