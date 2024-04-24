import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Compra, CompraDocument } from './schema/compra.schema';
import { Model } from 'mongoose';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import {
  Advertisement,
  AdvertisementDocument,
} from 'src/advertisements/schema/advertisement.schema';
import { ReviewCompraDto } from './dto/review-compra.dto';

@Injectable()
export class CompraService {
  constructor(
    @InjectModel(Compra.name)
    private compraModel: Model<CompraDocument>,
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<AdvertisementDocument>,
  ) {}

  async create(createCompra: CreateCompraDto): Promise<Compra> {
    const adv = await this.advertisementModel.findById(createCompra.adv_id);
    const seller_id = adv.sellerId;
    const res = {
      ...createCompra,
      seller_id: seller_id,
      is_ended: false,
      name: adv.name,
      confirmation_code: this.makeConfirmationCodeOfLength(5),
      price:
        createCompra.quantity *
        (await this.advertisementModel.findById(createCompra.adv_id))
          .pricePerKilogram,
    };
    const createdCompra = new this.compraModel(res);
    createdCompra.save();
    return await createdCompra._id;
  }

  async findAllFromSeller(sellerId: string) {
    return await this.compraModel
      .find({ seller_id: sellerId })
      .populate('adv_id')
      .populate('buyer_id')
      .exec();
  }

  async findAllFromBuyer(buyerId: string) {
    return await this.compraModel
      .find({ buyer_id: buyerId })
      .populate('adv_id')
      .populate('seller_id')
      .exec();
  }

  async delete(id: string) {
    return await this.compraModel.findByIdAndDelete(id);
  }

  async update(
    compraId: string,
    updateCompraDto: UpdateCompraDto,
  ): Promise<Compra> {
    const existingad = await this.compraModel.findByIdAndUpdate(
      compraId,
      updateCompraDto,
      { new: true },
    );
    if (!existingad) {
      throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
    }
    return existingad;
  }

  async review(
    compraId: string,
    reviewCompraDto: ReviewCompraDto,
  ): Promise<Compra> {
    console.log(reviewCompraDto);
    if (
      reviewCompraDto.confirmation_code !==
      (await this.findConfirmationCodeOfCompra(compraId))
    ) {
      //???????????
      throw new HttpException(
        'Incorrect confirmation code',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    const existingCompra = await this.compraModel.findByIdAndUpdate(
      compraId,
      reviewCompraDto,
      { new: true },
    );
    if (!existingCompra) {
      throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
    }
    console.log(existingCompra);
    const ad = await this.advertisementModel.findById(existingCompra.adv_id);
    if (!ad) {
      throw new NotFoundException(
        `Anuncio con ID ${existingCompra.adv_id} ha sido borrado`,
      );
    }
    ad.reviews.push(existingCompra.id);
    ad.save();
    return existingCompra;
  }

  async endCompra(id: string) {
    const compra = await this.compraModel.findById(id);
    await compra.update({ is_ended: true });
    await compra.save();
    return compra;
  }

  async findConfirmationCodeOfCompra(id: string): Promise<string> {
    const compra: Compra = await this.compraModel.findById(id).exec();
    return compra.confirmation_code;
  }

  makeConfirmationCodeOfLength(length): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
