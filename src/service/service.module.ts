import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { serviceSchema } from './models/service.model';
import { ServiceRepository } from './repository/service.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Service',
        schema: serviceSchema,
      },
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
