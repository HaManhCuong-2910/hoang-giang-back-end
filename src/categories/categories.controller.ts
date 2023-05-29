import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateTypeRoomDto } from './dto/CreateTypeRoom.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/type-room/create')
  async createTypeRoom(@Body() body: CreateTypeRoomDto) {
    return await this.categoriesService.createTypeRoom(body);
  }

  @Get('/type-room/list')
  async getListTypeRoom(
    @Query() query: { name: string; page: number; limit: number },
  ) {
    return await this.categoriesService.getListTypeRoom(query);
  }
}
