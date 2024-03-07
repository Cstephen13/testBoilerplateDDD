import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../../presentation/dto/update-user.dto';
import { getMilliseconds } from '../../../common/utils/date.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '../../../common/errors/errors';
import * as bcrypt from 'bcrypt';
import { IUser, UserDomain } from '../../domain/user';
import { UserDto } from '../../presentation/dto/user.dto';

@Injectable()
export class UserService {
  SALT_ROUNDS = 12;
  constructor(
    private readonly userDomain: UserDomain,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async return_chains(payload: any) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('auth.accessTokenExpires'),
      }),
      accessTokenExpiresIn: new Date(
        Date.now() +
          getMilliseconds(
            this.configService.get<string>('auth.accessTokenExpires'),
          ),
      ),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('auth.refreshExpires'),
        secret: this.configService.get<string>('auth.refreshSecret'),
      }),
    };
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userDomain.getInstance({
      email: createUserDto.email,
    });
    if (user) {
      throw new BadRequestException(Errors.EMAIL_ALREADY_EXISTS);
    } else {
      const passwordEncrypted = await bcrypt.hash(
        createUserDto.password,
        this.SALT_ROUNDS,
      );
      const userCreated = await this.userDomain.new({
        ...createUserDto,
        passwordEncrypted,
      });
      return new UserDto(
        userCreated.firstName,
        userCreated.lastName,
        userCreated.email,
        userCreated.isActive,
        userCreated.id,
      );
    }
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userDomain.getUsers();
    return users.map((user: IUser) => {
      return new UserDto(
        user.firstName,
        user.lastName,
        user.email,
        user.isActive,
        user.id,
      );
    });
  }

  async findOne(id: number): Promise<UserDto> {
    const instanceDomain = await this.userDomain.getInstance({ id: id });
    return new UserDto(
      instanceDomain.firstName,
      instanceDomain.lastName,
      instanceDomain.email,
      instanceDomain.isActive,
      instanceDomain.id,
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const oldUser = await this.userDomain.getInstance({ id: id });

    if (oldUser) {
      const updatedUser: IUser = await this.userDomain.update({
        id,
        ...updateUserDto,
      } as IUser);
      return new UserDto(
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.email,
        updatedUser.isActive,
        updatedUser.id,
      );
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const userToDelete = await this.userDomain.getInstance({ id: id });
    if (userToDelete) {
      return await this.userDomain.delete(id);
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
