import { ApiProperty } from '@nestjs/swagger';
import { GetProductDto } from './get-product.dto';

export class GetAllProductsDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [GetProductDto] })
  products: GetProductDto[];

  constructor(partial: Partial<GetAllProductsDto>) {
    Object.assign(this, partial);
  }
}
