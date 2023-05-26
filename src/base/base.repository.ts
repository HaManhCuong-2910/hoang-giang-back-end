import { HttpException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: any): Promise<any> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T> {
    const objectID = new ObjectId(id);
    return await this.model.findById(objectID, option);
  }

  async findByCondition(
    filter,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ) {
    return this.model.findOne(filter, field, option).populate(populate);
  }

  async getByCondition(
    filter,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter) {
    return this.model.deleteMany(filter);
  }

  async findByConditionAndUpdate(filter, update) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update, {
      new: true,
      upsert: true,
    });
  }

  async updateMany(filter, update, option?: any | null, callback?: any | null) {
    return this.model.updateMany(filter, update, option, callback);
  }

  async findByIdAndUpdate(id, update) {
    return await this.model.findByIdAndUpdate(id, update, {
      new: true,
      upsert: true,
    });
  }
}
