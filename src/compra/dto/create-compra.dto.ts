export class CreateCompraDto {
  adv_id: string;
  buyer_id: string;
  seller_id?: string;
  name: string;
  quantity: number;
  is_ended?: boolean;
  confirmation_code?: string;
  price?: number;
  review?: number;
  review_text?: string;
}
