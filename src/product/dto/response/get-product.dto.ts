import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<GetProductDto>) {
    Object.assign(this, partial);
  }
}
