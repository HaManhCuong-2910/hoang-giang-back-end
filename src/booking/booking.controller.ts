import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { roles } from 'src/common/common';
import { BookingService } from './booking.service';
import { CCreateBookingDto } from './dto/CreateBooking.dto';
import { CQuerySearchBookingDto } from './dto/QuerySearchBooking';
import { UpdateBookingDto } from './dto/UpdateBooking';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly BookingService: BookingService) {}

  @Get('/list')
  async GetListBooking(@Query() query: CQuerySearchBookingDto) {
    return await this.BookingService.GetListBooking(query);
  }

  @Get('/detail')
  async GetDetailBooking(@Query('id') id: string) {
    return await this.BookingService.GetDetailBooking(id);
  }

  @Post('/create')
  async createBooking(@Body() body: CCreateBookingDto) {
    return await this.BookingService.createBooking(body);
  }

  @Put('/update')
  async updateBooking(@Body() body: UpdateBookingDto) {
    return await this.BookingService.updateBooking(body);
  }
}
