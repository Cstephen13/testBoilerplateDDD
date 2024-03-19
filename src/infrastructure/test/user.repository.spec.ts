import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../database/repositories/user.repository';
import { DataSource, Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

export type UserRepositoryMock = Partial<Repository<User>>;
export type UserDataSourceMock = Partial<DataSource>;
export const repositoryMocked = (): UserRepositoryMock => ({
  findOne: jest.fn(),
});
export const dataSourceMock = (): UserDataSourceMock => ({
  getRepository: jest.fn().mockReturnValue(repositoryMocked()),
});
describe('UserRepository', () => {
  let repository: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSourceMock(),
        },
      ],
    }).compile();
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
  it('should be get instance from repository', () => {
    const instance = repository.getInstance();
    expect(instance).toBeInstanceOf(Object);
  });
});
