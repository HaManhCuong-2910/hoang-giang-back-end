import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { ObjectId } from 'mongodb';
import { Service } from '../models/service.model';

@Injectable()
export class ServiceRepository extends BaseRepository<Service> {
  constructor(
    @InjectModel('Service')
    private readonly serviceModel: Model<Service>,
  ) {
    super(serviceModel);
  }

  async countDocuments(filter) {
    return this.serviceModel.countDocuments(filter);
  }
}
