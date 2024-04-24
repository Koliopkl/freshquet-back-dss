import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { Compra, CompraDocument } from 'src/compra/schema/compra.schema';
import { CreateAdvertisementDTO } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import {
  Advertisement,
  AdvertisementDocument,
} from './schema/advertisement.schema';

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<AdvertisementDocument>,
    @InjectModel(Compra.name)
    private compraModel: Model<CompraDocument>,
  ) {}

  async create(
    createAdvertisement: CreateAdvertisementDTO,
  ): Promise<Advertisement> {
    const createdAdvertisement = new this.advertisementModel(
      createAdvertisement,
    );
    createdAdvertisement.save();
    return await createdAdvertisement._id;
  }

  async findAll(): Promise<Advertisement[]> {
    return await this.advertisementModel.find().populate('sellerId').exec();
  }

  async findAllFromSeller(sellerId: string) {
    return await this.advertisementModel
      .find({ sellerId: sellerId })
      .populate('sellerId')
      .exec();
  }
  async findN(n: number): Promise<Advertisement[]> {
    return await this.advertisementModel
      .find({ limit: n })
      .populate('sellerId')
      .exec();
  }

  async find(id: string) {
    return await this.advertisementModel.findById(id).populate('sellerId');
  }

  async delete(id: string) {
    return await this.advertisementModel.findByIdAndDelete(id);
  }

  async update(
    adId: string,
    updateAdvertisementDto: UpdateAdvertisementDto,
  ): Promise<Advertisement> {
    const existingad = await this.advertisementModel.findByIdAndUpdate(
      adId,
      updateAdvertisementDto,
      { new: true },
    );
    if (!existingad) {
      throw new NotFoundException(`Advertisement with ID ${adId} not found`);
    }
    return existingad;
  }

  async getImageNames(id: string) {
    const ad = await this.advertisementModel.findById(id);
    return ad.pictures;
  }

  async averageReview(id: string) {
    const advertisment = await this.find(id);
    const reviews = await Promise.all(
      advertisment.reviews.map(async (review) => {
        return await this.compraModel.findById(review);
      }),
    );

    let sum = 0;
    reviews.forEach((review) => {
      sum += review.review;
    });
    return sum / reviews.length;
  }
}
