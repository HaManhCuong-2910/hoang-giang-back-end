import { connectDataBase } from 'src/config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { jwtDefaultConfig } from 'src/config/jwt.config';
import { mailDefaultConfig } from 'src/config/mail.config';
import { BookingModule } from 'src/booking/booking.module';
import { RoomModule } from 'src/room/room.module';
import { ServiceModule } from 'src/service/service.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
export const importApp = [
  ...connectDataBase,
  ...jwtDefaultConfig,
  ...mailDefaultConfig,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    serveRoot: '/public/',
  }),
  ScheduleModule.forRoot(),
  BookingModule,
  RoomModule,
  AuthModule,
  ServiceModule,
  CategoriesModule,
];
