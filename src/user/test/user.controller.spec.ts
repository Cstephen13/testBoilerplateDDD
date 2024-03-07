import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../presentation/controller/user.controller';
import { UserService } from '../application/services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPort } from '../../infrastructure/ports/user.port';
import { UserDomain } from '../domain/user';
import { userDomainMock, userPortMock } from './user.service.spec';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('auth.secret'),
            global: true,
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [UserController],
      providers: [
        ConfigService,
        UserService,
        {
          provide: UserPort,
          useValue: userPortMock(),
        },
        {
          provide: UserDomain,
          useValue: userDomainMock(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
