import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TypeRoomRepository } from './repository/typeRooms.repository';
import { CreateTypeRoomDto } from './dto/CreateTypeRoom.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly typeRoomRepository: TypeRoomRepository) {}

  async createTypeRoom(body: CreateTypeRoomDto) {
    try {
      const res = await this.typeRoomRepository.create(body);
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async getListTypeRoom(query: { name: string; page: number; limit: number }) {
    const { page = 1, limit = 10, name } = query;

    const skip = Number(limit) * Number(page) - Number(limit);

    let querySearch = {};

    if (name) {
      querySearch['name'] = { $regex: '.*' + name + '.*', $options: 'i' };
    }

    const result = await this.typeRoomRepository.getByCondition(
      querySearch,
      undefined,
      { skip, limit, sort: { updatedAt: -1 } },
    );

    const countRecord = await this.typeRoomRepository.countDocuments(
      querySearch,
    );

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }
}
