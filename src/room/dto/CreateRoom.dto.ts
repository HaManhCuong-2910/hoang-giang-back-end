import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CCreateRoomDto {
  @IsNotEmpty()
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsNumber()
  prices: number;

  @IsNotEmpty()
  @IsArray()
  service: string[];

  @IsNotEmpty()
  @IsArray()
  OutstandingService: string[];

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  descriptions: string;

  @IsNotEmpty()
  @IsString()
  typeRoom: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  endow: string;
}
