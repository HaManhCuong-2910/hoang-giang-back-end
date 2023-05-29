import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { EStatusAccount } from 'src/common/common';
import { HttpStatusCommon } from 'src/common/http.exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const access_token: string = req.headers.authorization
        .toString()
        .split(' ')[1];
      const user: any = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      this.jwtService.verify(access_token, { secret: process.env.JWT_SECRET });

      const { status }: any = user;
      if (status === EStatusAccount.LOCK) {
        throw new HttpException('Tài khoản bị khóa', HttpStatusCommon.LOCKED);
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('token expired', HttpStatusCommon.EXPIRED);
      } else if (err.status === HttpStatusCommon.LOCKED) {
        throw err;
      } else {
        throw new UnauthorizedException();
      }
    }
    next();
  }
}
