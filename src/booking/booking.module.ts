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
import { roomSchema } from 'src/room/models/room.model';
import { RoomRepository } from 'src/room/repository/room.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Room',
        schema: roomSchema,
      },
      {
        name: 'Booking',
        schema: bookingSchema,
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [JwtService, BookingService, BookingRepository, RoomRepository],
})
export class BookingModule {}
