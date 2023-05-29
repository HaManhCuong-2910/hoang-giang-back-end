import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/userLogin.dto';
var md5 = require('md5');
import { AuthRepository } from './repository/auth.repository';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import {
  filterAccount,
  randomNumberCustomLength,
  saltOrRounds,
} from 'src/common/common';
import { AuthCreateDto } from './dto/authCreate.dto';
import * as bcrypt from 'bcrypt';
import {
  authForgotDto,
  resetForgotDto,
  resetPassDto,
} from './dto/authForgot.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(payload: UserLoginDto, isAdminLogin: boolean) {
    const { username, password } = UserLoginDto.plainToClass(payload);
    const resultLogin = await this.authRepository.validateUser(
      username,
      password,
      isAdminLogin,
    );
    if (resultLogin) {
      const access_token = this.authRepository.generate_access_token(
        filterAccount(resultLogin),
      );
      const refresh_token = this.authRepository.generate_refresh_token(
        filterAccount(resultLogin),
      );
      await this.cacheManager.set(
        `refresh_token_${resultLogin._id}`,
        refresh_token,
        { ttl: 172800 }, //2day
      );
      return {
        status: HttpStatus.ACCEPTED,
        access_token,
        user: resultLogin,
      };
    }
    throw new UnauthorizedException();
  }

  async forgotPassword(data: authForgotDto) {
    const { email } = data;

    const isExistAccount = await this.authRepository.findByCondition({
      email,
    });

    if (isExistAccount) {
      const resetCode = randomNumberCustomLength(6);
      await this.mailerService
        .sendMail({
          to: email,
          from: process.env.MAIL_SERVICE_USER,
          subject: `Mã lấy lại mật khẩu`,
          html: `<p style="font-size:32px;font-weight:500;margin:0px;width: 140px;display: block;text-align: center;background-color:#e5e5e5">${resetCode}</p>`,
        })
        .catch((err) => {
          throw new HttpException(
            'Gửi mã không thành công',
            HttpStatus.BAD_REQUEST,
          );
        });

      await this.cacheManager.set(`reset_code_${email}`, resetCode, {
        ttl: Math.pow(60, 5),
      });

      return {
        status: HttpStatus.ACCEPTED,
        message: 'Gửi mã thành công',
      };
    }

    throw new HttpException(
      'Tài khoản email chưa được đăng ký',
      HttpStatus.BAD_REQUEST,
    );
  }

  async resetForgotPassword(data: resetForgotDto) {
    const { code, email } = data;

    const reset_code = await this.cacheManager.get(`reset_code_${email}`);
    if (reset_code && Number(reset_code) === Number(code)) {
      const token_reset = this.jwtService.sign(data, {
        expiresIn: '1h',
      });

      await this.cacheManager.set(`token_reset_${email}`, token_reset, {
        ttl: 60 * 5,
      });

      return {
        status: HttpStatus.OK,
        data: {
          token_reset,
        },
        message: 'Xác minh thành công',
      };
    } else {
      throw new HttpException('Mã không chính xác', HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(data: resetPassDto) {
    const { password, token_reset, email } = data;

    const reset_token_cache = await this.cacheManager.get(
      `token_reset_${email}`,
    );
    if (
      reset_token_cache &&
      String(reset_token_cache) === String(token_reset)
    ) {
      const hashPassword = await bcrypt.hash(password, saltOrRounds);
      const newAccount = await this.authRepository.findByConditionAndUpdate(
        { email },
        { password: hashPassword },
      );

      return {
        status: HttpStatus.OK,
        data: newAccount,
        message: 'Cập nhật thành công',
      };
    }

    throw new HttpException(
      'Không thành công, vui lòng thử lại',
      HttpStatus.BAD_REQUEST,
    );
  }

  async refresh_access_token(request: Request) {
    try {
      const access_token: string = request.headers.authorization
        .toString()
        .split(' ')[1];
      return await this.authRepository.refresh_access_token(access_token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async register(payload: AuthCreateDto) {
    const dataUser = AuthCreateDto.plainToClass(payload);
    const { password, email, ...infoUser } = dataUser;
    const validateExistAccount = await this.authRepository.findByCondition({
      email,
    });

    if (validateExistAccount) {
      throw new HttpException('Đã tồn tại email', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    return await this.authRepository
      .create({ ...infoUser, email, password: hashPassword })
      .then((newUser) => {
        return {
          success: HttpStatus.OK,
          data: newUser,
        };
      })
      .catch((error) => {
        return {
          success: HttpStatus.BAD_REQUEST,
          data: error,
        };
      });
  }

  async logout(request: Request) {
    try {
      const access_token: string = request.headers.authorization
        .toString()
        .split(' ')[1];
      return await this.authRepository.remove_refresh_token(access_token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
