import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/base/base.dto';

export class authForgotDto extends BaseDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}

export class resetForgotDto extends BaseDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
  @IsNotEmpty()
  @Expose()
  code: string;
}

export class resetPassDto extends BaseDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
  @IsNotEmpty()
  @Expose()
  token_reset: string;
  @IsNotEmpty()
  @Expose()
  password: string;
}
