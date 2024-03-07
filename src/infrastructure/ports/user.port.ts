import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper.service';
import { IUser } from '../../user/domain/user';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UserPort {
  constructor(
    private userRepository: UserRepository,
    private userMapper: UserMapper,
  ) {}

  async saveUser(user: IUser) {
    const userLoaded = await this.userRepository.getInstance().findOneBy({
      email: user.email,
    });
    if (userLoaded) {
      return this.userMapper.toDomain(userLoaded);
    }
    const userAdded = await this.userRepository.getInstance().save(user);
    return this.userMapper.toDomain(userAdded);
  }

  async getUser(userId: number) {
    return await this.userRepository.getInstance().findOneBy({ id: userId });
  }

  async getUserBy(where: any) {
    const userEntity = await this.userRepository
      .getInstance()
      .findOneBy({ ...where });
    return userEntity === null ? null : this.userMapper.toDomain(userEntity);
  }

  async getUsers(): Promise<IUser[]> {
    const userEntities: User[] = await this.userRepository.getInstance().find();
    return userEntities.map((entity: User) => {
      return this.userMapper.toDomain(entity);
    });
  }

  async delete(id: number) {
    return await this.userRepository.getInstance().delete(id);
  }
}
