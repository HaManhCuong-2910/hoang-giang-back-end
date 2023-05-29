import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseDto } from 'src/base/base.dto';

export class AuthCreateDto extends BaseDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsOptional()
  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @IsString()
  @Expose()
  avatar: string;

  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  @Expose()
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  province_id: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  district_id: number;

  @IsString()
  @IsOptional()
  @Expose()
  address: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;
}
