import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../presentation/controller/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import authConfig from '../../config/auth.config';
import { AuthStub } from './stubs/auth.stub';

const keyChains = ['accessToken', 'accessTokenExpiresIn', 'refreshToken'];
const authServiceMock = () => ({
  login: jest.fn().mockReturnValue(keyChains),
  signUp: jest.fn().mockReturnValue(keyChains),
  getAccessToken: jest.fn().mockReturnValue(keyChains),
});
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig],
          envFilePath: '.env',
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return chain access chains', async () => {
      const response = await controller.login(AuthStub.params.userAuth);
      expect(response).toEqual(keyChains);
    });
  });
  describe('signUp', () => {
    it('should return access chains when user was created', async () => {
      const response = await controller.signUp(AuthStub.params.userCreate);
      expect(response).toEqual(keyChains);
    });
  });
  describe('getAccessToken', () => {
    it('should return access chains when user was created', async () => {
      const response = await controller.getAccessToken(AuthStub.params.refresh);
      expect(response).toEqual(keyChains);
    });
  });
});
