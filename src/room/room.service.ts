import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';
import { CCreateRoomDto } from './dto/CreateRoom.dto';
import { ObjectId } from 'mongodb';
import { QuerySearchRoomDto } from './dto/QuerySearchRoom.dto';
import { UpdateRoomDto } from './dto/UpdateRoom.dto';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

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
    return await this.roomRepository.findById(id);
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
