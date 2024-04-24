import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favourites, FavouritesDocument } from './schema/favourites.schema';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Favourites.name) private favsModel: Model<FavouritesDocument>,
  ) {}
  async getFavourites(id: string) {
    return await this.favsModel.find({ user_id: id }).exec();
  }

  //method to check if given user has given favourite
  async checkFavourite(id: string, favourite_id: string) {
    const count = await this.favsModel
      .find({ user_id: id, favourites: { $in: [favourite_id] } })
      .count();
    console.log(count);
    return count === 1;
  }

  //method to add favourite to user
  async addFavourite(id: string, favourite_id: string) {
    return await this.favsModel.updateOne(
      { user_id: id },
      { $push: { favourites: favourite_id } },
      { upsert: true },
    );
  }

  //method to delete favourite from user
  async deleteFavourite(id: string, favourite_id: string) {
    return await this.favsModel.updateOne(
      { user_id: id },
      { $pull: { favourites: favourite_id } },
    );
  }
}
