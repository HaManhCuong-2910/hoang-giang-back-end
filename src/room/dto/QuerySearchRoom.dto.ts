import { IsOptional, IsString } from 'class-validator';

export class QuerySearchRoomDto {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  quantity: number;

  @IsOptional()
  @IsString()
  typeRoom: string;
}

export class FindEmptyRoomDto {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  type_search: string;

  @IsOptional()
  @IsString()
  sort_value: string;

  @IsOptional()
  @IsString()
  checkInDate: string;

  @IsOptional()
  @IsString()
  checkOutDate: string;

  @IsOptional()
  @IsString()
  countNight: number;

  @IsOptional()
  @IsString()
  adult: number;

  @IsOptional()
  @IsString()
  children: number;
}
