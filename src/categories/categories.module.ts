import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { typeRoomSchema } from './models/typeRoom.model';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeRoomRepository } from './repository/typeRooms.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TypeRoom',
        schema: typeRoomSchema,
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, TypeRoomRepository],
})
export class CategoriesModule {}
