import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/services/user.service';
import { UserStub } from './stubs/user.stub';
import { UserDomain } from '../domain/user';
import { UserPort } from '../../infrastructure/ports/user.port';
import { when } from 'jest-when';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Errors } from '../../common/errors/errors';

/* Mocks */
export type UserDomainMock = Partial<Record<keyof UserDomain, jest.Mock>>;
export type UserPortMock = Partial<Record<keyof UserPort, jest.Mock>>;

export const userDomainMock = (): UserDomainMock => ({
  new: jest.fn(),
  getInstance: jest.fn().mockReturnValue(UserStub.repository.findOne),
});

export const userPortMock = (): UserPortMock => ({
  getUser: jest.fn().mockReturnValue(UserStub.repository.findOne),
  getUsers: jest.fn().mockReturnValue(UserStub.repository.findOne),
  saveUser: jest.fn().mockReturnValue(UserStub.repository.findOne),
  delete: jest.fn().mockReturnValue(UserStub.repository.findOne),
  getUserBy: jest.fn().mockReturnValue(UserStub.repository.findOne),
});

describe('UserService', () => {
  let service: UserService;
  let userDomainMocked: UserDomainMock;

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

  describe('findOne', () => {
    it('I can get user by id', async () => {
      when(userDomainMocked.getInstance)
        .calledWith(1)
        .mockReturnValue(UserStub.port.getInstance);
      const response = await service.findOne(1);
      expect(response).toEqual(UserStub.port.getInstance);
    });
  });

  describe('create', () => {
    it('I can get user by id', async () => {
      when(userDomainMocked.getInstance)
        .calledWith({ email: 'test1@gmail.com' })
        .mockReturnValue(UserStub.port.getInstance);

      when(userDomainMocked.new)
        .calledWith(UserStub.params.createUser)
        .mockReturnValue(UserStub.port.getInstance);
      try {
        await service.create(UserStub.params.createUser);
      } catch (e) {
        expect(e).toEqual(new BadRequestException(Errors.EMAIL_ALREADY_EXISTS));
      }
    });
  });
});
