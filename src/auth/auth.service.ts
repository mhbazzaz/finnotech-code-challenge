import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserSignInDto } from './dto/request/sign-in.dto';
import { UserSignInResponse } from './dto/response/user-sign-in-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/request/register-user.dto';
import { UserRegisterResponse } from './dto/response/user-register-response.dto';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';
import { UserVerifyResponse } from './dto/response/user-verify-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  //----------------------------------
  async signIn(data: UserSignInDto): Promise<UserSignInResponse> {
    const { email, password } = data;
    const foundedUser = await this.userService.getUserByEmail(email);

    if (!foundedUser) throw new NotFoundException('User not found!');
    if (!foundedUser.isVerified)
      throw new ForbiddenException('User must be verified first!');

    const isMatch = await this.isPasswordMatch(password, foundedUser.password);

    if (!isMatch) throw new UnauthorizedException('Password is incorrect!');

    const accessToken = await this.generateJwtToken(
      foundedUser.id,
      foundedUser.email,
    );

    return new UserSignInResponse({
      message: 'User has been signed-in successfully!',
      accessToken,
    });
  }

  //----------------------------------
  async register(data: RegisterUserDto): Promise<UserRegisterResponse> {
    const { email, firstName, password } = data;
    const foundedUser = await this.userService.getUserByEmail(email);

    if (foundedUser) throw new ConflictException('User is exists!');

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
    const userId = newUser.id;
    const verificationLink = `http://localhost:3010/auth/verifyUser/?userId=${userId}&code=${verificationCode}`;

    const verificationEmail = this.mailService.sendMail(
      email,
      firstName,
      verificationLink,
    );

    return new UserRegisterResponse({
      message: 'Verification link has beed sent!',
      verificationLink,
    });
  }

  //----------------------------------
  async verifyUser(userId: number, code: string): Promise<UserVerifyResponse> {
    const foundedUser = await this.userService.getUserById(userId);
    if (!foundedUser)
      throw new NotFoundException('User must be registered first!');

    const isCodeValid: boolean =
      foundedUser.verificationCode === code && userId === foundedUser.id
        ? true
        : false;

    if (!isCodeValid) {
      throw new ForbiddenException('Your verification link is incorrect!');
    }

    const [updatedUser, token] = await Promise.all([
      this.userService.updateUserVerification(foundedUser.id, true),
      this.generateJwtToken(userId, foundedUser.email),
    ]);

    if (!updatedUser)
      throw new InternalServerErrorException('Internal server error!');

    return new UserVerifyResponse({
      message: 'User has been verified successfully!',
      accessToken: token,
    });
  }

  //----------------------------------
  private async isPasswordMatch(
    inputPassword: string,
    dbPassword: string,
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
