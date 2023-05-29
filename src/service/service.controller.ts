import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ServiceCreateDto } from './dto/CreateService.dto';
import { ServiceService } from './service.service';
import { ApiTags } from '@nestjs/swagger';
import { QueryServiceDto } from './dto/QueryService.dto';
import { UpdateServiceDto } from './dto/UpdateService.dto';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/create')
  async createService(@Body() body: ServiceCreateDto) {
    return await this.serviceService.createService(body);
  }

  @Put('/update')
  async updateService(@Body() body: UpdateServiceDto) {
    return await this.serviceService.updateService(body);
  }

  @Get('/list')
  async getListService(@Body() query: QueryServiceDto) {
    return await this.serviceService.getListService(query);
  }
}
