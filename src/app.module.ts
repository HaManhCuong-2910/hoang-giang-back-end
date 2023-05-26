import { Module } from '@nestjs/common';
import { importApp } from './common/import';

@Module({
  imports: importApp,
  controllers: [],
  providers: [],
})
export class AppModule {}
