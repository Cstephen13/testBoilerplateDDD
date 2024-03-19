import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Errors } from '../../../common/errors/errors';
import { CreateUserDto } from '../../../user/presentation/dto/create-user.dto';
import { UserService } from '../../../user/application/services/user.service';
import { UserDomain } from '../../../user/domain/user';
@Injectable()
export class AuthService {
  constructor(
    private readonly userDomain: UserDomain,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.userDomain.getInstance({
      email: email,
    });
    if (user) {
      const isSamePassword = await bcrypt.compare(
        password,
        user.passwordEncrypted,
      );
      if (!isSamePassword) {
        throw new UnauthorizedException(Errors.CREDENTIALS_INVALID);
      }
      const payload = { id: user.id, email: user.email, sub: user.id };
      return await this.userService.getTokens(payload);
    } else {
      throw new BadRequestException();
    }
  }

  async signUp(userDto: CreateUserDto): Promise<any> {
    const userCreated = await this.userService.create(userDto);
    const payload = {
      id: userCreated.id,
      email: userCreated.email,
      sub: userCreated.id,
    };
    return await this.userService.getTokens(payload);
  }

  async getAccessToken(refreshToken: string): Promise<any> {
    try {
      const refreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('config.refreshSecret'),
      });
      const user = await this.userDomain.getInstance({
        id: refreshTokenPayload.id,
      });
      const payload = {
        id: user.id,
        email: user.email,
        sub: user.id,
      };
      return await this.userService.getTokens(payload);
    } catch (error) {
      throw new BadRequestException('Token invalido o ya expiró.');
    }
  }
}
