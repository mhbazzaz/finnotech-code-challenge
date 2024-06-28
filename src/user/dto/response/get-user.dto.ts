import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  verificationCode: string;

  @ApiProperty()
  isVerified: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<GetUserDto>) {
    Object.assign(this, partial);
  }
}
