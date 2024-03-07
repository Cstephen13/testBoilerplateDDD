import { Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TodosRepository {
  private readonly instance: Repository<TodoEntity>;

  constructor(private dataSource: DataSource) {
    this.instance = this.dataSource.getRepository(TodoEntity);
  }
  public getInstance(): Repository<TodoEntity> {
    return this.instance;
  }
  public async findCustom() {
    return this.instance
      .createQueryBuilder('todo')
      .orderBy('todo.createdAt')
      .getMany();
  }
}
