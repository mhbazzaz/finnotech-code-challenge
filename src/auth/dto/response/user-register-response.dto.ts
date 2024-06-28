import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  verificationLink: string;

  constructor(partial: Partial<UserRegisterResponse>) {
    Object.assign(this, partial);
  }
}
