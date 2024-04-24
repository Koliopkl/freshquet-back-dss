import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { Compra, CompraDocument } from 'src/compra/schema/compra.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Compra.name)
    private compraModel: Model<CompraDocument>,
    private readonly authService: AuthService,
  ) {}

  async findAllSeller(): Promise<User[]> {
    return await this.userModel.find({ userType: 'seller' }).exec();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(email);
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async register(createUser: CreateUserDto): Promise<{ access_token: string }> {
    const foundEmail = await this.checkEmail(createUser.email);
    const foundUsername = await this.checkUsername(createUser.username);
    if (foundEmail || foundUsername) {
      return null;
    } else {
      const createdUser = new this.userModel(createUser);
      createdUser.save();
      return await this.authService.login(createdUser);
    }
  }

  async findById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async getNameById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user.name;
  }

  async checkEmail(userEmail: string): Promise<boolean> {
    const user = await this.userModel.find({ email: userEmail });

    if (user.length != 0) {
      return true;
    }
    return false;
  }

  async findByUsername(userName: string) {
    const user = await this.userModel.find({ username: userName });
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const ads = updateUserDto.adsInSeeLater;
    const aux = [];
    ads.forEach((ad) => {
      if (!aux.includes(ad)) {
        aux.push(ad);
      }
    });
    if (aux.length != 0) {
      updateUserDto.adsInSeeLater = aux;
    }
    const existinguser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );
    if (!existinguser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return existinguser;
  }

  async getMapLocations() {
    const users = await this.userModel
      .find({
        userType: 'seller',
      })
      .select('name direction latitude longitude');
    return users;
  }

  async setCoordinates(
    userId: string,
    coordinates: {
      latitude: number;
      longitude: number;
    },
  ) {
    const user = await this.userModel.findById(userId);
    user.latitude = coordinates.latitude;
    user.longitude = coordinates.longitude;
    user.save();
  }

  async checkUsername(userName: string): Promise<boolean> {
    const user = await this.userModel.find({ username: userName });
    if (user.length != 0) {
      return true;
    }
    return false;
  }

  async getCoordinates(userId: string) {
    return this.userModel.findById(userId, {
      latitude: 1,
      longitude: 1,
      address: 1,
    });
  }

  async getAllReviews(userId: string) {
    return await this.compraModel.find({
      seller_id: userId,
      is_ended: true,
      review: { $exists: true },
    });
  }

  async getAverageRating(userId: string) {
    const ratings = await this.getAllReviews(userId);
    let sum = 0;
    ratings.forEach((rating) => (sum += rating.review));
    return (sum / ratings.length).toFixed(2);
  }
}
