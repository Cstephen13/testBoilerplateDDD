import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/services/auth.service';
import { UserService } from '../../user/application/services/user.service';
import { UserPort } from '../../infrastructure/ports/user.port';
import { UserDomain } from '../../user/domain/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthStub } from './stubs/auth.stub';
import { UserStub } from '../../user/test/stubs/user.stub';
import { when } from 'jest-when';
import appConfig from '../../config/app.config';
import authConfig from '../../config/auth.config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { userDomainMock, userPortMock } from '../../user/test/mocks/user.mocks';

export const jwtMockedService = () => ({
  signAsync: jest.fn().mockReturnValue('someToken'),
  verify: jest.fn().mockReturnValue({ id: 1 }),
});
describe('AuthService', () => {
  let service: AuthService;
  let userDomainMocked;
  let jwtServiceMocked;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig],
          envFilePath: '.env',
        }),
      ],
      providers: [
        ConfigService,
        AuthService,
        UserService,
        {
          provide: UserPort,
          useValue: userPortMock(),
        },
        {
          provide: UserDomain,
          useValue: userDomainMock(),
        },
        {
          provide: JwtService,
          useValue: jwtMockedService(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userDomainMocked = module.get<UserDomain>(UserDomain);
    jwtServiceMocked = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should to do authenticate', async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.repository.findOne,
      );
      const { email, password } = AuthStub.params.userAuth;
      const response = await service.login(email, password);
      const keysChains = Object.keys(response);
      expect(keysChains).toEqual([
        'accessToken',
        'accessTokenExpiresIn',
        'refreshToken',
      ]);
    });
    it("shouldn't to do authenticate because not found user", async () => {
      when(userDomainMocked.getInstance).mockReturnValue(null);
      const { email, password } = AuthStub.params.userAuth;

      await expect(service.login(email, password)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it("shouldn't to do authenticate error password", async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.repository.findOne,
      );
      await expect(
        service.login(AuthStub.params.userAuth.email, '586794'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
  describe('signUp  ', () => {
    it('should to do create user', async () => {
      when(userDomainMocked.getInstance).mockReturnValue(null);
      when(userDomainMocked.new).mockReturnValue(UserStub.repository.instance);
      const response = await service.signUp(AuthStub.params.userCreate);
      const keysChains = Object.keys(response);
      expect(keysChains).toEqual([
        'accessToken',
        'accessTokenExpiresIn',
        'refreshToken',
      ]);
    });
    it("shouldn't create user", async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.repository.instance,
      );
      await expect(
        service.signUp(AuthStub.params.userCreate),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('getAccessToken', () => {
    it('should return chain access chains', async () => {
      when(userDomainMocked.getInstance).mockReturnValue(
        UserStub.repository.instance,
      );
      const response = await service.getAccessToken(AuthStub.token);
      const keysChains = Object.keys(response);
      expect(keysChains).toEqual([
        'accessToken',
        'accessTokenExpiresIn',
        'refreshToken',
      ]);
    });

    it("shouldn't return access chains", async () => {
      when(jwtServiceMocked.verify).mockReturnValue(new Error('some fail'));
      when(userDomainMocked.getInstance).mockReturnValue(null);
      await expect(service.getAccessToken(AuthStub.token)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
