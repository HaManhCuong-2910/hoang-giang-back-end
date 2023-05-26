import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [],
  controllers: [BookingController],
  providers: [JwtService, BookingService],
})
export class BookingModule {}
