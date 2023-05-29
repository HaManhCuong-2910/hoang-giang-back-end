import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthService } from './auth.service';
import { AuthCreateDto } from './dto/authCreate.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { Request } from 'express';
import {
  authForgotDto,
  resetForgotDto,
  resetPassDto,
} from './dto/authForgot.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refresh_access_token')
  async refresh_access_token(@Req() request: Request) {
    return await this.authService.refresh_access_token(request);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: authForgotDto) {
    return await this.authService.forgotPassword(data);
  }

  @Post('/reset-forgot-password')
  async resetForgotPassword(@Body() data: resetForgotDto) {
    return await this.authService.resetForgotPassword(data);
  }

  @Post('/reset-password')
  async resetPassword(@Body() data: resetPassDto) {
    return await this.authService.resetPassword(data);
  }

  @Post('/login')
  async login(@Body() payload: UserLoginDto) {
    return await this.authService.login(payload, false);
  }

  @Post('/register')
  async register(@Body() payload: AuthCreateDto) {
    return await this.authService.register(payload);
  }

  @Post('/logout')
  async logout(@Req() request: Request) {
    return await this.authService.logout(request);
  }
}
