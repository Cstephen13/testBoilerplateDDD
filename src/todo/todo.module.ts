import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { mockTodoService } from './mocks/todo.mock';
import { TodosRepository } from '../infrastructure/database/repositories/todos.repository';

const createAsync = async (repository: any) => new TodoService(repository);
@Module({
  controllers: [TodoController],
  providers: [
    {
      provide: TodoService,
      useValue: mockTodoService,
    },
    {
      provide: 'TODO_ORIGINAL_SERVICE',
      useClass: TodoService,
    },
    {
      provide: 'TODO_FACTORY_SERVICE',
      useFactory: (repository: TodosRepository) => {
        return new TodoService(repository);
      },
      inject: [TodosRepository],
    },
    {
      provide: 'ASYNC_TODO_FACTORY_SERVICE',
      useFactory: async (repository: TodosRepository) => {
        console.log('lalalalalala');
        return await createAsync(repository);
      },
      inject: [TodosRepository],
    },
  ],
})
export class TodoModule {}
