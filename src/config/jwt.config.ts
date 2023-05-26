import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const jwtDefaultConfig = [
  ConfigModule.forRoot(),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
];
