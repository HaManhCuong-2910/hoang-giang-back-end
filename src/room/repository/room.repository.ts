import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { ObjectId } from 'mongodb';
import { Room } from '../models/room.model';
import { CCreateBookingDto } from 'src/booking/dto/CreateBooking.dto';

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

  async getRandom(size: string) {
    return this.roomModel.aggregate([{ $sample: { size: Number(size) } }]);
  }

  async verifyQuantityRoom(body: CCreateBookingDto) {
    const room: any = await this.roomModel.findOne({
      _id: new ObjectId(body.room),
    });

    if (!room) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Phòng này không tồn tại`,
      };
    }

    if (room.quantity < 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `Đã hết phòng trống`,
      };
    }

    return {
      status: HttpStatus.OK,
    };
  }

  async handleBooking(body: CCreateBookingDto) {
    await this.roomModel.updateOne(
      {
        _id: new ObjectId(body.room),
      },
      { $inc: { quantity: -1 } },
    );
  }

  async handleReRoom(id: string) {
    await this.roomModel.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $inc: { quantity: 1 } },
    );
  }
}
