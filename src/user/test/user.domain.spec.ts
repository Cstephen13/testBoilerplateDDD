import { UserDomain } from '../domain/user';
import { Test, TestingModule } from '@nestjs/testing';
import { UserPort } from '../../infrastructure/ports/user.port';
import { UserStub } from './stubs/user.stub';
import { userPortMock } from './mocks/user.mocks';

describe('UserDomain', () => {
  let domain: UserDomain;
  let userPortMocked;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDomain,
        {
          provide: UserPort,
          useValue: userPortMock(),
        },
      ],
    }).compile();

    domain = module.get<UserDomain>(UserDomain);
    userPortMocked = module.get<UserPort>(UserPort);
  });

  it('should be defined', () => {
    expect(domain).toBeDefined();
  });

  it('should create a new user', async () => {
    const response = await domain.new(UserStub.repository.findOne);
    expect({
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      isActive: response.isActive,
      passwordEncrypted: response.passwordEncrypted,
      id: response.id,
    }).toEqual(UserStub.repository.findOne);
  });

  it('should update a user', async () => {
    const response = await domain.update(UserStub.params.updateUser);
    expect(response).toEqual(UserStub.repository.findOne);
  });

  it('should delete a user', async () => {
    const response = await domain.delete(1);
    expect(response).toEqual(UserStub.repository.delete);
  });

  it('should get an instance of a user', async () => {
    const response = await domain.getInstance({ email: 'john@example.com' });
    expect({
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      isActive: response.isActive,
      passwordEncrypted: response.passwordEncrypted,
      id: response.id,
    }).toEqual(UserStub.repository.findOne);
  });

  it('should return undefined if no user is found', async () => {
    jest.spyOn(userPortMocked, 'getUserBy').mockReturnValue(null);
    const result = await domain.getInstance({
      email: 'nonexistent@example.com',
    });
    expect(result).toBeUndefined();
  });

  it('should return users', async () => {
    const result = await domain.getUsers();
    expect(result).toEqual(UserStub.repository.findAll);
  });
});
