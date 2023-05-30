import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryServiceDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  typeService: string;

  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;
}
