import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/response/get-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  //-----------------------------
  async createUser(data: CreateUserDto): Promise<GetUserDto> {
    const { email, password } = data;

    const isExistsUser = await this.getUserByEmail(email);
    if (isExistsUser) {
      throw new ConflictException('User is already exists!');
    }
    const salt = +process.env.SALT_PASSWORD;
    const hashedPassword = await bcrypt.hash(password, salt);

    const body = {
      ...data,
      password: hashedPassword,
    };

    const newUser = await this.db.user.create({
      data: body,
    });

    if (!newUser)
      throw new InternalServerErrorException('Internal server error!');

    return new GetUserDto(newUser);
  }
  //-----------------------------
  async getUserByEmail(email: string): Promise<GetUserDto> {
    try {
      return await this.db.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error!');
    }
  }

  //-----------------------------
  async getUserById(id: number): Promise<GetUserDto> {
    try {
      const foundedUser = await this.db.user.findUnique({
        where: { id },
      });

      return new GetUserDto(foundedUser);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error!');
    }
  }

  //-----------------------------
  async updateUserVerification(
    userId: number,
    status: boolean,
  ): Promise<GetUserDto> {
    try {
      const updatedUser = await this.db.user.update({
        where: { id: userId },
        data: { isVerified: status },
      });

      return new GetUserDto(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error!');
    }
  }
}
