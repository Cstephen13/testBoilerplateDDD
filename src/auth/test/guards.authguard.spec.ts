import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let configServiceMock: jest.Mocked<ConfigService>;
  let reflectorMock: jest.Mocked<Reflector>;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    jwtServiceMock = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configServiceMock = {
      get: jest.fn().mockReturnValue('secret'),
    } as unknown as jest.Mocked<ConfigService>;

    reflectorMock = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new AuthGuard(jwtServiceMock, configServiceMock, reflectorMock);

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer token',
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is public', async () => {
    reflectorMock.getAllAndOverride.mockReturnValueOnce(true);
    const result = await guard.canActivate(mockContext);
    expect(result).toBeTruthy();
  });

  it('should throw UnauthorizedException if no token provided', async () => {
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      headers: {},
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    jwtServiceMock.verifyAsync.mockRejectedValueOnce(new Error());

    await expect(guard.canActivate(mockContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should set user in request if token is valid', async () => {
    jwtServiceMock.verifyAsync.mockResolvedValueOnce({ userId: 1 });

    await guard.canActivate(mockContext);

    expect(mockContext.switchToHttp().getRequest()['user']).toEqual({
      userId: 1,
    });
  });
});
