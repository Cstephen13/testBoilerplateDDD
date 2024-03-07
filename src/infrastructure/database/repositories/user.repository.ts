import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private readonly instance: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.instance = this.dataSource.getRepository(User);
  }

  public getInstance(): Repository<User> {
    return this.instance;
  }
}
