import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TodoEntity } from '../infrastructure/database/entities/todo.entity';
import { CreateTodoDto } from './dto/create-tod-dto/create-todo-dto';
import { TodosRepository } from '../infrastructure/database/repositories/todos.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodosRepository) {}

  async getAllTodos() {
    return await this.todoRepository.getInstance().find();
  }

  async createTodo(newTodo: CreateTodoDto) {
    const todo = new TodoEntity();
    todo.name = newTodo.name;
    todo.description = newTodo.description;
    todo.isCompleted = newTodo.isCompleted;
    return await this.todoRepository.getInstance().save(todo);
  }

  async updateTodo(
    id: number,
    todoToUpdate: CreateTodoDto,
  ): Promise<TodoEntity> {
    const oldTodo = await this.todoRepository
      .getInstance()
      .findOne({ where: { id: id } });
    if (oldTodo) {
      oldTodo.name = todoToUpdate.name;
      oldTodo.description = todoToUpdate.description;
      return await this.todoRepository.getInstance().save(oldTodo);
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteTodo(id: number) {
    const todoToDelete = await this.todoRepository.getInstance().findOne({
      where: { id: id },
    });
    if (todoToDelete) {
      return await this.todoRepository.getInstance().delete(id);
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
