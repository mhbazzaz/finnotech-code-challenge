import { ApiProperty } from '@nestjs/swagger';

export class UserVerifyResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  accessToken: string;

  constructor(partial: Partial<UserVerifyResponse>) {
    Object.assign(this, partial);
  }
}
