import { UserPort } from '../ports/user.port';
import { UserRepository } from '../database/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper.service';
import { UserStub } from '../../user/test/stubs/user.stub';
export const repositoryMock = () => ({
  findOneBy: jest.fn().mockReturnValue(UserStub.repository.findOne),
  save: jest.fn().mockReturnValue(UserStub.repository.findOne),
  find: jest.fn().mockReturnValue(UserStub.repository.findAll),
  delete: jest.fn().mockReturnValue(UserStub.repository.delete),
});
describe('UserPort', () => {
  let userPort: UserPort;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      getInstance: jest.fn().mockReturnValue(repositoryMock()),
    } as unknown as jest.Mocked<UserRepository>;
    userPort = new UserPort(userRepositoryMock, new UserMapper());
  });

  it('should be defined', () => {
    expect(userPort).toBeDefined();
  });

  describe('saveUser', () => {
    it('should return user if exists on save', async () => {
      const result = await userPort.saveUser(UserStub.params.createUser);
      expect(result).toEqual(UserStub.repository.findOne);
    });
    it('should save user if not exists', async () => {
      jest
        .spyOn(userRepositoryMock.getInstance(), 'findOneBy')
        .mockReturnValue(null);
      const result = await userPort.saveUser(UserStub.params.createUser);
      expect(result).toEqual(UserStub.repository.findOne);
    });
  });

  describe('getUser', () => {
    it('should return an user', async () => {
      const result = await userPort.getUser(1);
      expect(result).toEqual(UserStub.repository.findOne);
    });
  });
  describe('getUserBy', () => {
    it('should return null if not exist', async () => {
      jest
        .spyOn(userRepositoryMock.getInstance(), 'findOneBy')
        .mockReturnValue(null);
      const result = await userPort.getUserBy({ email: '' });
      expect(result).toBeNull();
    });

    it('should return user', async () => {
      const result = await userPort.getUserBy({ email: '' });
      expect(result).toEqual(UserStub.repository.findOne);
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = await userPort.getUsers();
      expect(result).toEqual(UserStub.repository.findAll);
    });
  });

  describe('delete', () => {
    it('should save user if not exists', async () => {
      const result = await userPort.deleteUser(1);
      expect(result).toEqual(UserStub.repository.delete);
    });
  });
});
