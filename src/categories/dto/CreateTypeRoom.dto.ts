import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTypeRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}
