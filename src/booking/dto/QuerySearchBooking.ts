import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatusPaymentOrder } from 'src/common/common';

export class CQuerySearchBookingDto {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  @IsString()
  checkInDay: string;

  @IsOptional()
  @IsString()
  checkOutDay: string;

  @IsOptional()
  @IsString()
  nightCount: string;

  @IsOptional()
  @IsString()
  Adult: string;

  @IsOptional()
  @IsString()
  children: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsMobilePhone('vi-VN')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  statusPayment: number;

  @IsOptional()
  @IsString()
  status: string;
}
