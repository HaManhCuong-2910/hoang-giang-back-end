import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

export const mailDefaultConfig = [
  ConfigModule.forRoot(),
  MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_SERVICE_USER,
        pass: process.env.MAIL_SERVICE_PASS,
      },
    },
  }),
];
