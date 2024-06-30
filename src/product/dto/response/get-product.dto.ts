import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  creatorId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<GetProductDto>) {
    Object.assign(this, partial);
  }
}
