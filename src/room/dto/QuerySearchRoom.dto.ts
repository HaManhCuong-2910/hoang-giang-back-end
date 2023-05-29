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
