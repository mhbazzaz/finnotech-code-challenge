import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

export interface PayloadParams {
  userId: number;
  email: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split('Bearer ')[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as PayloadParams;

      const user = await this.db.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) throw new UnauthorizedException();

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
