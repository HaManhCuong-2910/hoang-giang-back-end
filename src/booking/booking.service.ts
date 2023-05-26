import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor() {}

  async GetPost() {
    return {
      message: process.env.DATABASE_URL,
      title: 'test',
    };
  }
}
