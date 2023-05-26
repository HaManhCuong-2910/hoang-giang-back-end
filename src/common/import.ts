import { connectDataBase } from 'src/config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { jwtDefaultConfig } from 'src/config/jwt.config';
import { mailDefaultConfig } from 'src/config/mail.config';
import { BookingModule } from 'src/booking/booking.module';
export const importApp = [
  ...connectDataBase,
  ...jwtDefaultConfig,
  ...mailDefaultConfig,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    serveRoot: '/public/',
  }),
  BookingModule,
];
