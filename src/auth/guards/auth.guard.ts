import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Errors } from '../../common/errors/errors';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req, res, next] = context.getArgs();
    console.log('req -------->', req);
    console.log('res -------->', res);
    console.log('next -------->', next);

    if (context.getType() === 'http') {
      console.log('-------->', context.getType());
      // do something that is only important in the context of regular HTTP requests (REST)
    } else if (context.getType() === 'rpc') {
      console.log('-------->', context.getType());
      // do something that is only important in the context of Microservice requests
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('handler -------->', context.getHandler());
    console.log('getClass -------->', context.getClass());
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException(Errors.CREDENTIALS_INVALID);
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('config.secret'),
      });
    } catch {
      throw new UnauthorizedException(Errors.CREDENTIALS_INVALID);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
