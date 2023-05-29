import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ServiceRepository } from './repository/service.repository';
import { ServiceCreateDto } from './dto/CreateService.dto';
import { QueryServiceDto } from './dto/QueryService.dto';
import { UpdateServiceDto } from './dto/UpdateService.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async createService(body: ServiceCreateDto) {
    try {
      const res = await this.serviceRepository.create(body);
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async updateService(body: UpdateServiceDto) {
    const { id, ...updateDtoData } = body;

    const updateDataResponse = await this.serviceRepository
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

  async getListService(query: QueryServiceDto) {
    const { page = 1, limit = 10, name } = query;

    const skip = Number(limit) * Number(page) - Number(limit);

    let querySearch = {};

    if (name) {
      querySearch['name'] = { $regex: '.*' + name + '.*', $options: 'i' };
    }

    const countRecord = await this.serviceRepository.countDocuments(
      querySearch,
    );

    const result = await this.serviceRepository.getByCondition(
      querySearch,
      undefined,
      { skip, limit, sort: { updatedAt: -1 } },
    );

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }
}
