import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
