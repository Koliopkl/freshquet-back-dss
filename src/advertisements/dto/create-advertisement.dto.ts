import { Category } from 'src/shared/interfaces/category';

export class CreateAdvertisementDTO {
  name: string;
  description: string;
  pricePerKilogram: number;
  category: Category;
  averageReviewScore: number;
  sellerId: string;
  pictures: string[];
}
