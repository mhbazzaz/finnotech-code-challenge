import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSignInDto } from './dto/request/sign-in.dto';
import { UserSignInResponse } from './dto/response/user-sign-in-response.dto';
import { RegisterUserDto } from './dto/request/register-user.dto';
import { UserRegisterResponse } from './dto/response/user-register-response.dto';
import { UserVerifyResponse } from './dto/response/user-verify-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //----------------------------------
  @ApiOperation({ summary: 'User Sign-In' })
  @ApiBody({ type: UserSignInDto })
  @ApiResponse({
    status: 200,
    description: 'User has been signed-in successfully!',
    type: UserSignInResponse,
  })
  @Post('signIn')
  async signIn(@Body() data: UserSignInDto): Promise<UserSignInResponse> {
    return await this.authService.signIn(data);
  }

  //----------------------------------
  @ApiOperation({ summary: 'User Register' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 200,
    description: 'User has been registered successfully!',
    type: UserRegisterResponse,
  })
  @Post('register')
  async register(@Body() data: RegisterUserDto): Promise<UserRegisterResponse> {
    return await this.authService.register(data);
  }

  //----------------------------------
  @ApiOperation({ summary: 'User Verfication' })
  @ApiResponse({
    status: 200,
    description: 'User has been verified successfully!',
    type: UserRegisterResponse,
  })
  @ApiQuery({ name: 'userId', required: true, description: 'User-Id' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Verification Code That Was Mailed To User',
  })
  @Get('verifyUser')
  async verifyUser(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('code') code: string,
  ): Promise<UserVerifyResponse> {
    return await this.authService.verifyUser(userId, code);
  }
}
