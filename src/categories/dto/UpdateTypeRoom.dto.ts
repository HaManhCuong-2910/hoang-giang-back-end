import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTypeRoomDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}
