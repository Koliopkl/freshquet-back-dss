import {
  Body,
  Controller,
  Post,
  Delete,
  UseGuards,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ReviewCompraDto } from './dto/review-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Controller('compra')
export class CompraController {
  constructor(private compraService: CompraService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createComprar: CreateCompraDto) {
    console.log(createComprar);
    return await this.compraService.create(createComprar);
  }

  @Get('all/sell/:id')
  async findAllFromSeller(@Param('id') sellerId: string) {
    return await this.compraService.findAllFromSeller(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/confirmation_code')
  async findConfirmationCodeOfCompra(@Param('id') id: string): Promise<string> {
    return await this.compraService.findConfirmationCodeOfCompra(id);
  }

  @Get('all/buy/:id')
  async finddAllFromBuyer(@Param('id') buyerId: string) {
    return await this.compraService.findAllFromBuyer(buyerId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.compraService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() compra: UpdateCompraDto) {
    return await this.compraService.update(id, compra);
  }

  @Put(':id/end')
  async endCompra(@Param('id') id: string) {
    return await this.compraService.endCompra(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/review')
  async review(@Param('id') id: string, @Body() compra: ReviewCompraDto) {
    return await this.compraService.review(id, compra);
  }
}
