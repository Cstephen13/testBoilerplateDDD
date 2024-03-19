export abstract class AuthStub {
  static params = {
    userAuth: {
      email: 'test2@gmail.com',
      password: '123456',
    },
    userCreate: {
      firstName: 'test',
      lastName: 'test',
      email: 'test2@gmail.com',
      password: '123456',
    },
    refresh: {
      refreshToken: 'someToken',
    },
  };
  static token = 'SomeToken';
}
