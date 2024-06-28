import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  //----------------------------------
  sendMail(recipient: string, recipientName: string, url: string) {
    this.mailService.sendMail({
      from: `${process.env.MAIL_SENDER_NAME} <${process.env.MAIL_SENDER_ACCOUNT}>`,
      to: recipient,
      subject: 'Verification Link',
      text: `Hello ${recipientName} , your verification link :\n  ${url}`,
    });
  }
}
