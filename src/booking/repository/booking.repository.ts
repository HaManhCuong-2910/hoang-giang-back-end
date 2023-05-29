import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { Booking } from '../models/booking.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<Booking>,
  ) {
    super(bookingModel);
  }

  async countDocuments(filter) {
    return this.bookingModel.countDocuments(filter);
  }
}
