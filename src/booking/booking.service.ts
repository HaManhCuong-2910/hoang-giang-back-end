import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CCreateBookingDto } from './dto/CreateBooking.dto';
import { BookingRepository } from './repository/booking.repository';
import { ObjectId } from 'mongodb';
import { CQuerySearchBookingDto } from './dto/QuerySearchBooking';
import * as moment from 'moment';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async GetListBooking(query: CQuerySearchBookingDto) {
    const {
      page = 1,
      limit = 10,
      checkInDay,
      checkOutDay,
      nightCount,
      Adult,
      children,
      name,
      ...filterSearch
    } = query;
    const countNightCustom = moment(checkOutDay).diff(
      moment(checkInDay),
      'days',
    );

    if (countNightCustom < 0 || Number(nightCount) < 0) {
      throw new HttpException('Số đêm không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    if (Number(Adult) <= 0 && Number(children) <= 0) {
      throw new HttpException(
        'Số lượng người lớn hoặc trẻ em không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const skip = Number(limit) * Number(page) - Number(limit);

    let querySearch = [];

    if (checkInDay) {
      querySearch.push({
        checkInDay: {
          $gte: new Date(checkInDay),
        },
      });
    }

    if (name) {
      querySearch.push({ name: { $regex: '.*' + name + '.*', $options: 'i' } });
    }

    if (checkOutDay) {
      querySearch.push({
        checkOutDay: {
          $lt: new Date(checkOutDay),
        },
      });
    }

    if (nightCount) {
      querySearch.push({
        nightCount,
      });
    }

    if (Adult) {
      querySearch.push({
        'AmountPeople.Adult': Adult,
      });
    }

    if (children) {
      querySearch.push({
        'AmountPeople.children': children,
      });
    }

    if (Object.keys(filterSearch).length > 0) {
      querySearch.push(filterSearch);
    }

    const result = await this.bookingRepository.getByCondition(
      querySearch.length > 0
        ? {
            $and: querySearch,
          }
        : {},
      undefined,
      { skip, limit, sort: { updatedAt: -1 } },
      [
        {
          path: 'room',
          model: 'Room',
          populate: [
            {
              path: 'service',
              model: 'Service',
            },
            {
              path: 'typeRoom',
              model: 'TypeRoom',
            },
          ],
        },
        {
          path: 'service.id',
          model: 'Service',
        },
      ],
    );

    const countRecord = await this.bookingRepository.countDocuments(
      querySearch,
    );

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }

  async createBooking(body: CCreateBookingDto) {
    try {
      const { room, checkInDay, checkOutDay, ...filterData } = body;
      const newCheckInDay = new Date(checkInDay);
      const newCheckOutDay = new Date(checkOutDay);
      const objectID = new ObjectId(room);
      const res = await this.bookingRepository.create({
        ...filterData,
        room: objectID,
        checkInDay: newCheckInDay,
        checkOutDay: newCheckOutDay,
      });
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async GetDetailBooking(id: string) {
    try {
      const objectID = new ObjectId(id);
      const result = await this.bookingRepository.findByCondition(
        { _id: objectID },
        undefined,
        undefined,
        [
          {
            path: 'room',
            model: 'Room',
            populate: [
              {
                path: 'service',
                model: 'Service',
              },
              {
                path: 'typeRoom',
                model: 'TypeRoom',
              },
            ],
          },
          {
            path: 'service.id',
            model: 'Service',
          },
        ],
      );

      if (result) {
        return {
          status: HttpStatus.OK,
          data: result,
        };
      }

      throw new HttpException('Không tìm thấy đơn', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException('Không tìm thấy đơn', HttpStatus.NOT_FOUND);
    }
  }
}
