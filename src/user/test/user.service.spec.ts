import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/services/user.service';
import { UserStub } from './stubs/user.stub';
import { UserDomain } from '../domain/user';
import { UserPort } from '../../infrastructure/ports/user.port';
import { when } from 'jest-when';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Errors } from '../../common/errors/errors';
import appConfig from '../../config/app.config';
import authConfig from '../../config/auth.config';
import { userDomainMock, userPortMock } from './mocks/user.mocks';

/* Mocks */
export type UserDomainMock = Partial<Record<keyof UserDomain, jest.Mock>>;
export type UserPortMock = Partial<Record<keyof UserPort, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userDomainMocked: UserDomainMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig],
          envFilePath: '.env',
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            secret: UserStub.secretTest,
            global: true,
          }),
        }),
      ],
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

    service = module.get<UserService>(UserService);
    userDomainMocked = module.get(UserDomain);
  });

  it('should be defined', () => {
    expect(userDomainMocked).toBeDefined();
  });

  //TODO: move this to auth spec
  it('should return chain auth', async () => {
    const chains = await service.getTokens(UserStub.payloadChains);
    const keysChains = Object.keys(chains);
    expect(keysChains).toEqual([
      'accessToken',
      'accessTokenExpiresIn',
      'refreshToken',
    ]);
  });

  describe('findOne', () => {
    it('I can get user by id', async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.port.getInstance,
      );
      const response = await service.findOne(1);
      expect(response).toEqual(UserStub.port.getInstance);
    });
  });

  describe('create', () => {
    it("i can't create users", async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ email: 'test1@gmail.com' })
        .mockReturnValue(UserStub.port.getInstance);
      try {
        await service.create(UserStub.params.createUser);
      } catch (e) {
        expect(e).toEqual(new BadRequestException(Errors.EMAIL_ALREADY_EXISTS));
      }
    });
    it('i can create user', async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ email: 'test1@gmail.com' })
        .mockReturnValue(null);
      when(userDomainMocked.new).mockReturnValue(UserStub.port.getInstance);
      const response = await service.create(UserStub.params.createUser);
      expect(response).toEqual(UserStub.repository.instance);
    });
  });

  describe('findAll', () => {
    it('i get all users', async () => {
      const response = await service.findAll();
      expect(response).toEqual(UserStub.service.findAll);
    });
  });

  describe('update', () => {
    it("i can't update user", async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ id: 1 })
        .mockReturnValue(null);
      try {
        await service.update(1, UserStub.params.updateUser);
      } catch (e) {
        expect(e).toEqual(new HttpException('Not Found', HttpStatus.NOT_FOUND));
      }
    });

    it('i can  update user', async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ id: 1 })
        .mockReturnValue(UserStub.repository.instance);

      when(userDomainMocked.update).mockReturnValue({
        ...UserStub.repository.instance,
        ...UserStub.params.updateUser,
      });

      const response = await service.update(1, UserStub.params.updateUser);
      expect(response).toEqual({
        ...UserStub.repository.instance,
        ...UserStub.params.updateUser,
      });
    });
  });

  describe('remove', () => {
    it("i can't remove user", async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ id: 1 })
        .mockReturnValue(null);
      try {
        await service.remove(1);
      } catch (e) {
        expect(e).toEqual(new HttpException('Not Found', HttpStatus.NOT_FOUND));
      }
    });
    it('i can remove user', async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.repository.findOne,
      );
      const response = await service.remove(1);
      expect(response).toEqual(UserStub.repository.delete);
    });
  });
});
