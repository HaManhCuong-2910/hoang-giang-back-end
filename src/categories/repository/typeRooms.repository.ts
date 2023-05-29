import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { ObjectId } from 'mongodb';
import { TypeRoom } from '../models/typeRoom.model';

@Injectable()
export class TypeRoomRepository extends BaseRepository<TypeRoom> {
  constructor(
    @InjectModel('TypeRoom')
    private readonly typeRoomModel: Model<TypeRoom>,
  ) {
    super(typeRoomModel);
  }

  async countDocuments(filter) {
    return this.typeRoomModel.countDocuments(filter);
  }
}
