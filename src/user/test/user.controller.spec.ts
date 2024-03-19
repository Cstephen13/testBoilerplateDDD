import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../presentation/controller/user.controller';
import { UserService } from '../application/services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPort } from '../../infrastructure/ports/user.port';
import { UserDomain } from '../domain/user';
import { UserStub } from './stubs/user.stub';
import { when } from 'jest-when';
import { HttpException } from '@nestjs/common';
import { userDomainMock, userPortMock } from './mocks/user.mocks';

describe('UserController', () => {
  let controller: UserController;
  let userMocked;

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

    userMocked = module.get<UserDomain>(UserDomain);
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be create user', async () => {
      when(userMocked.new).mockReturnValue(UserStub.repository.instance);
      const response = await controller.create(UserStub.params.createUser);
      expect(response).toEqual(UserStub.repository.instance);
    });
  });

  describe('findAll', () => {
    it('should be find all users', async () => {
      const response = await controller.findAll();
      expect(response).toEqual(UserStub.service.findAll);
    });
  });

  describe('findOne', () => {
    it('should be find on user', async () => {
      when(userMocked.getInstance).mockReturnValue(
        UserStub.repository.instance,
      );
      const response = await controller.findOne('1');
      expect(response).toEqual(UserStub.repository.instance);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      when(userMocked.getInstance).mockReturnValue(
        UserStub.repository.instance,
      );
      when(userMocked.update).mockReturnValue(UserStub.repository.instance);
      const response = await controller.update('1', UserStub.params.updateUser);
      expect(response).toEqual(UserStub.repository.instance);
    });

    it('should error not found user', async () => {
      when(userMocked.getInstance).mockReturnValue(null);
      await expect(
        controller.update('1', UserStub.params.updateUser),
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      when(userMocked.getInstance).mockReturnValue(
        UserStub.repository.instance,
      );
      const response = await controller.remove('1');
      expect(response).toEqual(UserStub.repository.delete);
    });
    it("shouldn't delete user", async () => {
      when(userMocked.getInstance).mockReturnValue(null);
      await expect(controller.remove('1')).rejects.toThrowError(HttpException);
    });
  });
});
