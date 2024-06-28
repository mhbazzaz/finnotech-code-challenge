import { ApiProperty } from '@nestjs/swagger';

export class UserSignInResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  accessToken: string;

  constructor(partial: Partial<UserSignInResponse>) {
    Object.assign(this, partial);
  }
}
