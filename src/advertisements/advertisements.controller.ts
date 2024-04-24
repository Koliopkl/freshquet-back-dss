import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import path = require('path');
import { of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementDTO } from './dto/create-advertisement.dto';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private adsService: AdvertisementsService) {}

  @Get('all')
  async findAll() {
    return await this.adsService.findAll();
  }

  @Get('all/:id')
  async findAllFromSeller(@Param('id') sellerId: string) {
    return await this.adsService.findAllFromSeller(sellerId);
  }

  @Get('limit')
  async findN(@Body() limit: number) {
    return await this.adsService.findN(limit);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.adsService.find(id);
  }

  @Get(':id/averageReview')
  async averageReview(@Param('id') id: string) {
    return await this.adsService.averageReview(id);
  }

  @Post('create')
  async create(@Body() advertisement: CreateAdvertisementDTO) {
    return await this.adsService.create(advertisement);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() advertisement: CreateAdvertisementDTO,
  ) {
    return await this.adsService.update(id, advertisement);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.adsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':adid/uploadimages')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      fileFilter(req, file, cb) {
        console.log(1);
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './uploads/advertisements',
        filename: (req: any, file, cb) => {
          console.log(2);
          const id: string = req.params.adid;
          const filename: string = id + randomUUID();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadImagesOfAd(
    @UploadedFiles() files,
    @Param('adid') adid,
    @Request() req,
  ) {
    const filesnames: string[] = files.map((file) => {
      return file.filename;
    });
    const adv = this.adsService.update(adid, {
      pictures: filesnames,
    });
    return adv;
  }

  @Get(':adid/images')
  findAdImageNames(@Param('adid') adid: string) {
    const imagenames = this.adsService.getImageNames(adid);
    return imagenames;
  }

  @Get(':adid/images/:imagename')
  findAdImage(
    @Param('adid') adid: string,
    @Param('imagename') imagename: string,
    @Res() res,
  ) {
    return of(
      res.sendFile(
        //join(process.cwd(), `uploads/advertisements/${adid}/${imagename}`),
        join(process.cwd(), `uploads/advertisements/${imagename}`),
      ),
    );
  }
}
