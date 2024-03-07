import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Errors } from '../common/errors/errors';
import { CreateUserDto } from '../user/presentation/dto/create-user.dto';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { UserService } from '../user/application/services/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.getInstance().findOne({
      where: {
        email: email,
      },
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
      return await this.userService.return_chains(payload);
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
    return await this.userService.return_chains(payload);
  }

  async getAccessToken(refreshToken: string): Promise<any> {
    try {
      const refreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('config.refreshSecret'),
      });
      const user = await this.userRepository
        .getInstance()
        .findOne(refreshTokenPayload.id);
      const payload = {
        id: user.id,
        email: user.email,
        sub: user.id,
      };
      return await this.userService.return_chains(payload);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Token invalido o ya expiró.');
    }
  }
}
