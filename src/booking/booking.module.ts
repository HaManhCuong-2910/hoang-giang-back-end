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
import { BookingRepository } from './repository/booking.repository';
import { bookingSchema } from './models/booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Booking',
        schema: bookingSchema,
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [JwtService, BookingService, BookingRepository],
})
export class BookingModule {}
