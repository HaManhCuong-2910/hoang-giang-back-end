import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ETypeService } from 'src/common/common';

export class ServiceCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsEnum(ETypeService)
  typeService: ETypeService;

  @IsOptional()
  @IsNumber()
  price: number;
}
