import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EStatusBookingRoom, EStatusPaymentOrder } from 'src/common/common';
import { TServiceBooking } from './DefaultType.dto';

export class UpdateBookingDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(EStatusPaymentOrder)
  statusPayment: EStatusPaymentOrder;

  @IsOptional()
  @IsString()
  @IsEnum(EStatusBookingRoom)
  status: EStatusBookingRoom;
}
