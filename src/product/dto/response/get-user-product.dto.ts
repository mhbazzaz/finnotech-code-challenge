import { ApiProperty } from '@nestjs/swagger';
import { GetProductDto } from './get-product.dto';

export class GetUserProductsDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty({ type: [GetProductDto] })
  products: GetProductDto[];

  constructor(partial: Partial<GetUserProductsDto>) {
    Object.assign(this, partial);
  }
}
