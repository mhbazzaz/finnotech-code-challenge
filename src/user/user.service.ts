import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/response/get-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  //-----------------------------
  async createUser(data: RegisterUserDto): Promise<GetUserDto> {
    const { firstName, lastName, email, password } = data;

    const isExistsUser = await this.getUserByEmail(email);
    if (isExistsUser) {
      throw new ConflictException();
    }
    const salt = process.env.SALT_PASSWORD;
    const hashedPassword = await bcrypt.hash(password, salt);

    const body = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const newUser = await this.db.user.create({
      data: body,
    });

    if (!newUser) throw new InternalServerErrorException();

    return new GetUserDto(newUser);
  }
  //-----------------------------
  async getUserByEmail(email: string): Promise<GetUserDto> {
    return await this.db.user.findUnique({
      where: { email },
    });
  }
}
