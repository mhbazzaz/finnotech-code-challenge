import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserSignInDto } from './dto/request/sign-in.dto';
import { UserSignInResponse } from './dto/response/user-sign-in-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/request/register-user.dto';
import { UserRegisterResponse } from './dto/response/user-register-response.dto';
import * as uuid from 'uuid';
import { MailerService } from 'src/mail/mail.service';
import { UserVerifyResponse } from './dto/response/user-verify-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  //----------------------------------
  async signIn(data: UserSignInDto): Promise<UserSignInResponse> {
    try {
      const { email, password } = data;
      const foundedUser = await this.userService.getUserByEmail(email);

      if (!foundedUser) throw new NotFoundException();
      if (!foundedUser.isVerified)
        throw new ForbiddenException('User must be verified first!');

      const isMatch = await this.isPasswordMatch(
        password,
        foundedUser.password,
      );

      if (!isMatch) throw new ForbiddenException();

      const accessToken = await this.generateJwtToken(
        foundedUser.id,
        foundedUser.email,
      );

      return new UserSignInResponse({
        message: 'User has been signed-in successfully!',
        accessToken,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //----------------------------------
  async register(data: RegisterUserDto): Promise<UserRegisterResponse> {
    try {
      //check user not exists
      const { email, password } = data;
      const foundedUser = await this.userService.getUserByEmail(email);

      if (foundedUser) throw new ConflictException();

      //create user record with isVerified = false
      const salt = +process.env.SALT_PASSWORD;
      const verificationCode = uuid.v4();

      const hashedPassword = await bcrypt.hash(password, salt);
      const body = {
        ...data,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
      };

      const newUser = await this.userService.createUser(body);

      //send email verification
      const userId = newUser.id;
      const verificationUrl = `http://localhost:3010/auth/verifyUser/?userId=${userId}&code=${verificationCode}`;
      // await this.mailerService.sendEmail() //// send url with tracking code to click on it

      return new UserRegisterResponse({
        message: 'Verification link has beed sent!',
        verificationLink: verificationUrl,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //----------------------------------
  async verifyUser(userId: number, code: string): Promise<UserVerifyResponse> {
    try {
      const foundedUser = await this.userService.getUserById(userId);
      if (!foundedUser) throw new NotFoundException();

      let isCodeValid: boolean =
        foundedUser.verificationCode === code && userId === foundedUser.id
          ? true
          : false;

      if (!isCodeValid) {
        throw new ForbiddenException();
      }

      const updatedUser = await this.userService.updateUserVerification(
        foundedUser.id,
        true,
      );
      const token = await this.generateJwtToken(userId, foundedUser.email);
      return new UserVerifyResponse({
        message: 'User has been verified successfully!',
        accessToken: token,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //----------------------------------
  private async isPasswordMatch(
    dbPassword: string,
    inputPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(inputPassword, dbPassword);
  }

  //----------------------------------
  async generateJwtToken(userId: number, email: string): Promise<any> {
    return this.jwtService.sign({
      userId,
      email,
    });
  }
}
