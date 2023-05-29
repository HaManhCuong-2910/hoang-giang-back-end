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

export class CAmountPeople {
  @IsOptional()
  Adult: number;

  @IsOptional()
  children: number;
}

export class CCreateBookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsArray()
  service: TServiceBooking[];

  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  checkInDay: string;

  @IsNotEmpty()
  @IsString()
  checkOutDay: string;

  @IsNotEmpty()
  @IsString()
  room: string;

  @IsNotEmpty()
  @IsNumber()
  nightCount: number;

  @IsNotEmpty()
  @IsNumber()
  prices: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CAmountPeople)
  AmountPeople: CAmountPeople;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(EStatusPaymentOrder)
  statusPayment: EStatusPaymentOrder;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EStatusBookingRoom)
  status: EStatusBookingRoom;
}
