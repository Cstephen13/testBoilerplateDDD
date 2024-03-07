import { Mapper } from './mapperInterface';
import { User } from '../database/entities/user.entity';
import { IUser } from '../../user/domain/user';

export class UserMapper implements Mapper<User, IUser> {
  toDomain(entity: User): IUser {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      isActive: entity.isActive,
    } as IUser;
  }
}
