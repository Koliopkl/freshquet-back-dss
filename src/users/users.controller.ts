import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { hash } from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    await hash(createUser.password, 5).then((hash) => {
      createUser.password = hash;
    });
    return await this.usersService.register(createUser).then((res) => {
      console.log(res);
      if (res) {
        return res;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Username or email is already registered',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findByUsername(req.user.username);
  }

  @Get(':username/profilebyUsername')
  getProfileByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':id/profile')
  getProfileById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('sellers')
  getAllSellers() {
    return this.usersService.findAllSeller();
  }

  @Get(':id/name')
  getNameById(@Param('id') id: string) {
    return this.usersService.getNameById(id);
  }

  @Get('mapLocations')
  getMapLocations() {
    return this.usersService.getMapLocations();
  }

  @UseGuards(JwtAuthGuard)
  @Get('type')
  getType(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('edit')
  updateUser(@Request() req, @Body() updateUser: UpdateUserDto) {
    return this.usersService.updateUser(req.user.userId, updateUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put('location')
  setCoordinates(
    @Request() req,
    @Body()
    coordinates: {
      latitude: number;
      longitude: number;
    },
  ) {
    return this.usersService.setCoordinates(req.user.userId, coordinates);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
          //console.log(1);
          const user: any = req.user;
          const filename: string = user.userId.toString();
          //path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension: string = path.parse(file.originalname).ext;
          //console.log(`${filename}${extension}`);
          cb(null, `${filename}${extension}`);
          //console.log(2);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file, @Request() req) {
    //console.log(3);
    const user = req.user;
    //console.log(user);

    this.usersService.updateUser(user.userId, {
      profile_picture: file.filename,
    });
  }

  @Get('profile-picture/:imgname')
  findProfilePicture(@Param('imgname') id: string, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + id)));
  }

  @Post('coordinates')
  getCoordinates(@Body() userIds: string[]) {
    const promises = [];
    userIds.forEach((id) => {
      promises.push(this.usersService.getCoordinates(id));
    });
    return Promise.all(promises).then((res) => {
      return res;
    });
  }

  @Get(':id/review/all')
  async getAllReviews(@Param('id') id: string) {
    return await this.usersService.getAllReviews(id);
  }

  @Get(':id/averagerating')
  async getAverageRating(@Param('id') id: string) {
    return await this.usersService.getAverageRating(id);
  }
}
