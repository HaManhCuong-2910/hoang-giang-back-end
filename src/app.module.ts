import { Module } from '@nestjs/common';
import { importApp } from './common/import';
import { AppService } from './app.service';

@Module({
  imports: importApp,
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
