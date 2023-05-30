import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ETypeService } from 'src/common/common';

export class UpdateServiceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ETypeService)
  typeService: ETypeService;

  @IsOptional()
  @IsNumber()
  price: number;
}
