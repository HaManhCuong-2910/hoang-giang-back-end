import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

export const connectDataBase = [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.DATABASE_URL),
];
