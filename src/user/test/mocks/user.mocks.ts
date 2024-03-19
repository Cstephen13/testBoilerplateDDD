import { UserStub } from '../stubs/user.stub';
import { UserDomainMock, UserPortMock } from '../user.service.spec';

export const userDomainMock = (): UserDomainMock => ({
  new: jest.fn(),
  getInstance: jest.fn(),
  getUsers: jest.fn().mockReturnValue(UserStub.repository.findAll),
  update: jest.fn(),
  delete: jest.fn().mockReturnValue(UserStub.repository.delete),
});

export const userPortMock = (): UserPortMock => ({
  getUser: jest.fn().mockReturnValue(UserStub.repository.findOne),
  getUsers: jest.fn().mockReturnValue(UserStub.repository.findAll),
  saveUser: jest.fn().mockReturnValue(UserStub.repository.findOne),
  deleteUser: jest.fn().mockReturnValue(UserStub.repository.delete),
  getUserBy: jest.fn().mockReturnValue(UserStub.repository.findOne),
});
