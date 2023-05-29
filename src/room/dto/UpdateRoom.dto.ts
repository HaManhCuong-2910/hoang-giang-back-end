import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsOptional()
  @IsNumber()
  prices: number;

  @IsOptional()
  @IsArray()
  service: string[];

  @IsOptional()
  @IsArray()
  OutstandingService: string[];

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  descriptions: string;

  @IsOptional()
  @IsString()
  typeRoom: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  endow: string;
}
