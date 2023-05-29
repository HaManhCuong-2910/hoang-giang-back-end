import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { jwtDefaultConfig } from 'src/config/jwt.config';
import { MongooseModule } from '@nestjs/mongoose';
import { accountSchema } from './models/account.model';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ...jwtDefaultConfig,
    MongooseModule.forFeature([
      {
        name: 'Account',
        schema: accountSchema,
      },
    ]),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true,
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
