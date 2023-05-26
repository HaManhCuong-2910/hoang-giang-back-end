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

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly BookingService: BookingService) {}

  @Get('/list')
  async GetPost() {
    return await this.BookingService.GetPost();
  }
}
