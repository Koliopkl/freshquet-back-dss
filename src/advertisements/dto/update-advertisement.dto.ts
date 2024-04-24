import { CreateAdvertisementDTO } from './create-advertisement.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAdvertisementDto extends PartialType(
  CreateAdvertisementDTO,
) {}
