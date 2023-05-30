import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CCreateRoomDto } from './dto/CreateRoom.dto';
import { FindEmptyRoomDto, QuerySearchRoomDto } from './dto/QuerySearchRoom.dto';
import { UpdateRoomDto } from './dto/UpdateRoom.dto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  async createRoom(@Body() body: CCreateRoomDto) {
    return await this.roomService.createRoom(body);
  }

  @Get('/list')
  async getListRoom(@Query() query: QuerySearchRoomDto) {
    return await this.roomService.getListRoom(query);
  }

  @Get('/empty-room')
  async findEmptyRoom(@Query() query: FindEmptyRoomDto) {
    return await this.roomService.findEmptyRoom(query);
  }

  @Post('/check-empty-room')
  async checkEmptyRoom(@Body() body: any) {
    return await this.roomService.checkEmptyRoom(body);
  }

  @Get('/random-list')
  async getRandomListRoom(@Query('size') size: string) {
    return await this.roomService.getRandomListRoom(size);
  }

  @Put('/update')
  async updateRoom(@Body() data: UpdateRoomDto) {
    return await this.roomService.updateRoom(data);
  }

  @Delete('/:id/delete')
  async deleteRoom(@Param('id') id: string) {
    return await this.roomService.deleteRoom(id);
  }

  @Get('/:id/detail')
  async getDetailRoom(@Param('id') id: string) {
    return await this.roomService.getDetailRoom(id);
  }
}
