import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
