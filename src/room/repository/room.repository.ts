import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { ObjectId } from 'mongodb';
import { Room } from '../models/room.model';

@Injectable()
export class RoomRepository extends BaseRepository<Room> {
  constructor(
    @InjectModel('Room')
    private readonly roomModel: Model<Room>,
  ) {
    super(roomModel);
  }

  async countDocuments(filter) {
    return this.roomModel.countDocuments(filter);
  }
}
