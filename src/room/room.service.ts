import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';
import { CCreateRoomDto } from './dto/CreateRoom.dto';
import { ObjectId } from 'mongodb';
import {
  FindEmptyRoomDto,
  QuerySearchRoomDto,
} from './dto/QuerySearchRoom.dto';
import { UpdateRoomDto } from './dto/UpdateRoom.dto';
import { BookingRepository } from 'src/booking/repository/booking.repository';
import { EStatusBookingRoom } from 'src/common/common';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly bookingRepository: BookingRepository,
  ) {}

  async createRoom(body: CCreateRoomDto) {
    try {
      const res = await this.roomRepository.create(body);
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async getListRoom(query: QuerySearchRoomDto) {
    const { page = 1, limit = 10, title, typeRoom, ...filterSearch } = query;

    const skip = Number(limit) * Number(page) - Number(limit);

    let querySearch = [];

    if (title) {
      querySearch.push({
        title: { $regex: '.*' + title + '.*', $options: 'i' },
      });
    }
    if (typeRoom) {
      querySearch.push({ typeRoom: new ObjectId(typeRoom) });
    }

    if (Object.keys(filterSearch).length > 0) {
      querySearch.push(filterSearch);
    }

    const result = await this.roomRepository.getByCondition(
      querySearch.length > 0
        ? {
            $and: querySearch,
          }
        : {},
      undefined,
      { skip, limit, sort: { updatedAt: -1 } },
      [
        {
          path: 'service',
          model: 'Service',
        },
        {
          path: 'OutstandingService',
          model: 'Service',
        },
        {
          path: 'typeRoom',
          model: 'TypeRoom',
        },
      ],
    );

    const countRecord = await this.roomRepository.countDocuments(querySearch);

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }

  async findEmptyRoom(query: FindEmptyRoomDto) {
    const {
      page = 1,
      limit = 10,
      type_search,
      checkInDate,
      checkOutDate,
      countNight,
      adult,
      children,
      sort,
      sort_value,
    } = query;

    const skip = Number(limit) * Number(page) - Number(limit);
    let countRecord = 0;
    let result: any = null;

    if (type_search === 'booking') {
      let querySearch = [];
      let sortQuery = { updatedAt: -1 };

      if (checkInDate) {
        querySearch.push({
          checkInDay: {
            $gte: new Date(checkInDate),
          },
        });
      }

      if (checkOutDate) {
        querySearch.push({
          checkOutDay: {
            $lte: new Date(checkOutDate),
          },
        });
      }

      if (countNight) {
        querySearch.push({
          countNight,
        });
      }

      if (adult) {
        querySearch.push({
          'AmountPeople.Adult': adult,
        });
      }

      if (children) {
        querySearch.push({
          'AmountPeople.children': children,
        });
      }

      if (sort === 'prices' && sort_value) {
        sortQuery = { ...sortQuery, ...{ prices: Number(sort_value) } };
      }

      result = await this.bookingRepository.getByCondition(
        querySearch.length > 0
          ? {
              $and: querySearch,
            }
          : {},
        'room',
        { skip, limit, sort: { ...sortQuery } },
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
              {
                path: 'OutstandingService',
                model: 'Service',
              },
            ],
          },
        ],
      );

      if (result.length > 0) {
        result = result.map((item) => item.room);

        result = result.reduce((unique, o) => {
          if (!unique.some((obj) => obj._id === o._id)) {
            unique.push(o);
          }
          return unique;
        }, []);

        if (sort === 'typeRoom' && sort_value) {
          result = result.filter((item) => item.typeRoom._id === sort_value);
        }
      }

      countRecord = await this.bookingRepository.countDocuments(querySearch);
    } else {
      if (sort === 'prices' && sort_value) {
        result = await this.roomRepository.getByCondition(
          {},
          undefined,
          { skip, limit, sort: { prices: Number(sort_value) } },
          [
            {
              path: 'service',
              model: 'Service',
            },
            {
              path: 'OutstandingService',
              model: 'Service',
            },
            {
              path: 'typeRoom',
              model: 'TypeRoom',
            },
          ],
        );

        countRecord = await this.roomRepository.countDocuments({});
      } else if (sort === 'typeRoom' && sort_value) {
        result = await this.roomRepository.getByCondition(
          { typeRoom: sort_value },
          undefined,
          { skip, limit, sort: { updatedAt: -1 } },
          [
            {
              path: 'service',
              model: 'Service',
            },
            {
              path: 'OutstandingService',
              model: 'Service',
            },
            {
              path: 'typeRoom',
              model: 'TypeRoom',
            },
          ],
        );

        countRecord = await this.roomRepository.countDocuments({});
      } else {
        result = await this.roomRepository.getByCondition(
          {},
          undefined,
          { skip, limit, sort: { updatedAt: -1 } },
          [
            {
              path: 'service',
              model: 'Service',
            },
            {
              path: 'OutstandingService',
              model: 'Service',
            },
            {
              path: 'typeRoom',
              model: 'TypeRoom',
            },
          ],
        );

        countRecord = await this.roomRepository.countDocuments({});
      }
    }

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }

  async checkEmptyRoom(body: any) {
    const { id, checkInDate, checkOutDate } = body;

    const resRoom = await this.roomRepository.findById(id);
    if (resRoom?.quantity > 0) {
      return {
        status: HttpStatus.OK,
        data: 'Vẫn còn phòng trống',
      };
    }

    const resBooking = await this.bookingRepository.findByCondition({
      $and: [
        {
          room: id,
        },
        {
          $or: [
            {
              checkOutDay: {
                $lt: new Date(checkInDate),
              },
            },
            {
              checkInDay: {
                $gt: new Date(checkOutDate),
              },
            },
          ],
        },
        {
          status: EStatusBookingRoom.DA_NHAN_PHONG,
        },
      ],
    });

    if (resBooking) {
      return {
        status: HttpStatus.OK,
        data: 'Vẫn còn phòng trống',
      };
    }

    return {
      status: HttpStatus.NOT_FOUND,
      data: 'Đã hết phòng',
    };
  }

  async getRandomListRoom(size: string) {
    const res = await this.roomRepository.getRandom(size);
    return {
      data: res,
    };
  }

  async updateRoom(data: UpdateRoomDto) {
    const { id, ...updateDtoData } = data;

    const updateDataResponse = await this.roomRepository
      .findByIdAndUpdate(id, {
        ...updateDtoData,
      })
      .then((res) => {
        return {
          success: HttpStatus.OK,
          data: res,
        };
      })
      .catch((error) => {
        return {
          success: HttpStatus.BAD_REQUEST,
          data: error,
        };
      });

    return updateDataResponse;
  }

  async getDetailRoom(id: string) {
    const objectID = new ObjectId(id);
    return await this.roomRepository.findByCondition(
      { _id: objectID },
      undefined,
      undefined,
      [
        {
          path: 'service',
          model: 'Service',
        },
        {
          path: 'typeRoom',
          model: 'TypeRoom',
        },
        {
          path: 'OutstandingService',
          model: 'Service',
        },
      ],
    );
  }

  async deleteRoom(id: string) {
    try {
      await this.roomRepository.deleteOne(id);

      return {
        status: HttpStatus.OK,
        message: 'Thành công',
      };
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }
}
