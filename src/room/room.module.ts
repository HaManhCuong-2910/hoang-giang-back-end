import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { roomSchema } from './models/room.model';
import { RoomRepository } from './repository/room.repository';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { bookingSchema } from 'src/booking/models/booking.model';
import { BookingRepository } from 'src/booking/repository/booking.repository';

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
  providers: [RoomService, RoomRepository, JwtService, BookingRepository],
  controllers: [RoomController],
})
export class RoomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/room/create', method: RequestMethod.POST },
        { path: '/room/update', method: RequestMethod.PUT },
        { path: '/room/:id/delete', method: RequestMethod.DELETE },
      );
  }
}
